"use client"

import {useEffect, useMemo, useRef, useState} from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { PointMaterial, Points, OrbitControls, Html } from "@react-three/drei"
import { Points as PointsImpl, Vector3 } from 'three'
import useGraphLayout from "@/components/view/graphview/useGraphLayout";
import Link from "next/link";
import {useRouter} from "next/navigation";


export interface ArticleGraph {
    clusters: Record<number,number[]>;
    edges: VectorEdge[];
}

export interface VectorEdge{
    u_title: string;
    v_title: string;
    u: number;
    v: number;
    w: number;
}


function Scene({ clusters, edges }: ArticleGraph) {
    const router = useRouter()
    const pointsRef = useRef<PointsImpl>(null!)
    const lineRef = useRef<THREE.LineSegments>(null!);

    const [focusPoint, setFocusPoint] = useState<THREE.Vector3 | null>(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

    const controlsRef = useRef<any>(null!);


    const { nodePosition } = useGraphLayout({ clusters, edges })

    const { positions, colors, rawPositions, titles } = useMemo(() => {
        const posArray: number[] = [];
        const colorArray: number[] = [];
        const rawPos: THREE.Vector3[] = [];
        const titleArray: string[] = [];

        // 타이틀을 찾기 위한 맵핑 (edges에서 추출)
        const titleMap: Record<number, string> = {};
        edges.forEach(e => {
            titleMap[e.u] = e.u_title;
            titleMap[e.v] = e.v_title;
        });

        const clusterKeys = Object.keys(clusters);

        clusterKeys.forEach((cKey, clusterIdx) => {
            // 클러스터별로 예쁜 색상 부여 (HSL 기반 고대비 색상)
            const color = new THREE.Color().setHSL(clusterIdx / clusterKeys.length, 0.8, 0.6);
            const nodes = clusters[Number(cKey)];

            nodes.forEach((nodeId) => {
                const pos = nodePosition[nodeId];
                if (pos) {
                    // Float32Array용 1차원 배열에 xyz 밀어넣기
                    posArray.push(pos.x, pos.y, pos.z);
                    // 색상 RGB 밀어넣기
                    colorArray.push(color.r, color.g, color.b);

                    // Html 태그용 원본 객체 및 타이틀 저장
                    rawPos.push(pos);
                    titleArray.push(titleMap[nodeId] || `Node ${nodeId}`);
                }
            });
        });

        return {
            positions: new Float32Array(posArray),
            colors: new Float32Array(colorArray),
            rawPositions: rawPos,
            titles: titleArray
        };
    }, [clusters, nodePosition, edges]);

    const linePositions = useMemo(() => {
        const lineArray: number[] = [];

        edges.forEach(edge => {
            const p1 = nodePosition[edge.u];
            const p2 = nodePosition[edge.v];

            // 두 노드의 좌표가 모두 존재할 때만 선을 이음
            if (p1 && p2) {
                lineArray.push(p1.x, p1.y, p1.z); // 시작점
                lineArray.push(p2.x, p2.y, p2.z); // 끝점
            }
        });

        return new Float32Array(lineArray);
    }, [edges, nodePosition]);

    //선택된 노드 색상 변경
    useEffect(() => {
        if (lastSelectedIndex !== null && pointsRef.current) {
            const attr = pointsRef.current.geometry.attributes.color;

            attr.setXYZ(lastSelectedIndex, 0.3, 0.9, 0.0);
            attr.needsUpdate = true;
        }

        return () => {
            if (lastSelectedIndex !== null && pointsRef.current) {
                const attr = pointsRef.current.geometry.attributes.color;

                attr.setXYZ(lastSelectedIndex, 1, 1, 1);
                attr.needsUpdate = true;
            }
        };
    }, [lastSelectedIndex, colors]);

    const handleNodeClick = (index:number|undefined) =>{
        if(index === undefined || !pointsRef.current) return;


        if(lastSelectedIndex == index){
            router.push(`/article/${index}`)
            return;
        }

        setLastSelectedIndex(index);

        const targetNodePos = rawPositions[index];
        if(targetNodePos) setFocusPoint(targetNodePos.clone())
    }

    useFrame((state) => {
        if (focusPoint) {
            // 1. 현재 카메라와 타겟 사이의 거리(오프셋)를 계산
            // 사용자가 보고 있던 각도를 그대로 유지하기 위함
            const currentOffset = new THREE.Vector3().subVectors(
                state.camera.position,
                controlsRef.current.target
            );

            // 2. 새로운 카메라 목표 위치 = 클릭한 노드 좌표 + 기존 오프셋
            const targetCamPos = new THREE.Vector3().addVectors(focusPoint, currentOffset);

            const distance = state.camera.position.distanceTo(targetCamPos);

            if (distance > 0.05) {
                // 카메라 위치만 부드럽게 이동 (회전 발생 안 함)
                state.camera.position.lerp(targetCamPos, 0.1);
                // 컨트롤 타겟도 노드 위치로 부드럽게 이동
                controlsRef.current.target.lerp(focusPoint, 0.1);
            } else {
                // 도착 시 상태 해제
                setFocusPoint(null);
            }
        }

        if (controlsRef.current) {
            controlsRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.05}

                maxDistance={500}
                minDistance={5}

                ref={controlsRef}
            />

            <Points
                ref={pointsRef}
                positions={positions}
                colors={colors}
                stride={3}
                onPointerDown={(e)=>{
                    e.stopPropagation()
                    handleNodeClick(e.index)
                }}
            >
                <PointMaterial
                    size={0.6}
                    vertexColors
                    transparent={true}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.NormalBlending}
                />
            </Points>

            {rawPositions.map((pos, i) => (
                <Html
                    key={i}
                    position={[pos.x, pos.y + 0.6, pos.z]}
                    distanceFactor={ 12 }
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
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={linePositions.length / 3}
                        array={linePositions}
                        itemSize={3}
                        args={[linePositions, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="white"
                    transparent
                    opacity={0.15} // 선이 너무 쨍하면 별이 안 보이니 은은하게
                    depthWrite={false}
                />
            </lineSegments>
        </>
    );
}

interface Props {
    graph: ArticleGraph|undefined
}

export default function ArticleGraphView({ graph }: Props) {
    if (!graph) return null;

    return (
        <div className="fixed inset-0 -z-10 w-full h-full" style={{ mixBlendMode: 'difference' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <Scene {...graph} />
            </Canvas>
        </div>
    );
}