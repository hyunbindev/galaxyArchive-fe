"use client"

import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { PointMaterial, Points, OrbitControls, Html } from "@react-three/drei"
import { Points as PointsImpl, Vector3 } from 'three'

// 1. 데이터 인터페이스 정의
export interface ArticleEdge {
    u_title: string;
    v_title: string;
    u: number;
    v: number;
    w: number;
}

interface Props {
    edges: ArticleEdge[]
}

// 2. 메인 그래픽 렌더링 컴포넌트
function Scene({ edges }: { edges: ArticleEdge[] }) {
    const pointsRef = useRef<PointsImpl>(null!)
    const lineRef = useRef<THREE.LineSegments>(null!)
    const controlsRef = useRef<any>(null!)
    const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, 0))

    // 데이터 분석 및 좌표/제목 추출 (useMemo로 연산 최적화)
    const { positions, colors, rawPositions, nodeIndexMap, titles } = useMemo(() => {
        const uniqueNodes = new Map<number, string>();
        edges.forEach(e => {
            uniqueNodes.set(e.u, e.u_title);
            uniqueNodes.set(e.v, e.v_title);
        });

        const nodeIds = Array.from(uniqueNodes.keys());
        const nodeTitles = Array.from(uniqueNodes.values());
        const count = nodeIds.length;

        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const raw: Vector3[] = [];
        const indexMap = new Map<number, number>();

        nodeIds.forEach((id, i) => {
            indexMap.set(id, i);

            // 성단(Cluster) 파라미터
            const nodesPerGroup = 10;
            const groupId = Math.floor(i / nodesPerGroup);
            const indexInGroup = i % nodesPerGroup;
            const groupCount = Math.ceil(count / nodesPerGroup);

            // 1. 성단 중심점 배치 (피보나치 분포)
            const clusterRadius = 25;
            const cPhi = Math.acos(1 - 2 * (groupId / groupCount));
            const cTheta = Math.PI * (1 + Math.sqrt(5)) * groupId;

            const centerX = Math.sin(cPhi) * Math.cos(cTheta) * clusterRadius;
            const centerY = Math.sin(cPhi) * Math.sin(cTheta) * clusterRadius;
            const centerZ = Math.cos(cPhi) * clusterRadius;

            // 2. 님께서 설계하신 w 기반 좌표 공식
            const relevantEdges = edges.filter(e => e.u === id || e.v === id);
            const maxW = relevantEdges.length > 0
                ? Math.max(...relevantEdges.map(e => e.w))
                : 0.1;

            // 유사도 w가 높을수록 중심에 가깝게 (r이 작아짐)
            const baseDistance = 2;
            const r = (1-maxW) * baseDistance;
            const theta = indexInGroup * Math.PI * (3 - Math.sqrt(5));

            // 입체감을 위한 z축 보정 (1-w 활용)
            const x = centerX + Math.cos(theta) * r;
            const y = centerY + Math.sin(theta) * r;
            const z = centerZ + (Math.sin(i) * (maxW) * 3);

            pos.set([x, y, z], i * 3);
            cols.set([1, 1, 1], i * 3); // 기본 흰색
            raw.push(new THREE.Vector3(x, y, z));
        });

        return {
            positions: pos,
            colors: cols,
            rawPositions: raw,
            nodeIndexMap: indexMap,
            titles: nodeTitles
        };
    }, [edges]);

    // 엣지(선) 연결 인덱스 생성
    const lineIndices = useMemo(() => {
        const indices: number[] = [];
        edges.forEach(edge => {
            const uIdx = nodeIndexMap.get(edge.u);
            const vIdx = nodeIndexMap.get(edge.v);

            if (uIdx !== undefined && vIdx !== undefined) {
                const p1 = rawPositions[uIdx];
                const p2 = rawPositions[vIdx];
                indices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            }
        });
        return new THREE.Float32BufferAttribute(indices, 3);
    }, [edges, rawPositions, nodeIndexMap]);

    // 클릭 시 카메라 타겟 이동
    const handlePointClick = (e: any) => {
        e.stopPropagation();
        if (e.index !== undefined) {
            const idx = e.index;
            setTargetPos(new THREE.Vector3(
                positions[idx * 3],
                positions[idx * 3 + 1],
                positions[idx * 3 + 2]
            ));
        }
    };

    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.target.lerp(targetPos, 0.1);
            controlsRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls
                ref={controlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.05}
            />

            <Points
                ref={pointsRef}
                positions={positions}
                colors={colors}
                stride={3}
                onClick={handlePointClick}
            >
                <PointMaterial
                    size={0.6}
                    vertexColors
                    transparent
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* 제목 텍스트 레이어 */}
            {rawPositions.map((pos, i) => (
                <Html
                    key={i}
                    position={[pos.x, pos.y + 0.6, pos.z]}
                    distanceFactor={12}
                    style={{
                        pointerEvents: 'none',
                        color: 'white',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                        textShadow: '0 0 4px rgba(0,0,0,0.9)',
                        opacity: 0.8
                    }}
                >
                    {titles[i]}
                </Html>
            ))}

            <lineSegments ref={lineRef}>
                <bufferGeometry attributes={{ position: lineIndices }} />
                <lineBasicMaterial
                    color="white"
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                />
            </lineSegments>
        </>
    );
}

// 3. 최상위 컴포넌트
export default function ArticleGraphView({ edges }: Props) {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full" style={{ mixBlendMode: 'difference' }}>
            <Canvas camera={{ position: [20, 20, 20], fov: 60 }}>
                <Scene edges={edges} />
            </Canvas>
        </div>
    )
}