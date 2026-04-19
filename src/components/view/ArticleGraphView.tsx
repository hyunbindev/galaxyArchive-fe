"use client"

import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { PointMaterial, Points, OrbitControls, Html } from "@react-three/drei"
import { Points as PointsImpl, Vector3 } from 'three'
import {edgeSandboxNextRequestContext} from "next/dist/server/web/sandbox/context";


export interface ArticleGraph {
    clusters: Record<number,number[]>;
    edges: VectorEdge[];
}

interface VectorEdge{
    u_title: string;
    v_title: string;
    u: number;
    v: number;
    w: number;
}


function Scene({ clusters, edges }: ArticleGraph) {
    const pointsRef = useRef<PointsImpl>(null!)
    const lineRef = useRef<THREE.LineSegments>(null!);

    const { nodePosition } = useMemo(() => {
        const clusterCenters: Record<string, THREE.Vector3> = {};
        const nodePosition: Record<number, THREE.Vector3> = {};

        const edgesMap: Record<number, VectorEdge> = {};
        edges.forEach((edge) => {
            edgesMap[edge.u] = edge;
        });

        const sortedClusters = Object.entries(clusters)
            .sort((a, b) => b[1].length - a[1].length); // 내림차순 정렬

        const totalClusters = sortedClusters.length;
        const phi = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < totalClusters; i++) {
            const [clusterKeys, nodes] = sortedClusters[i];

            if (i === 0) {
                clusterCenters[clusterKeys] = new THREE.Vector3(0, 0, 0);
            } else {
                const radius = phi*totalClusters+10;
                const divisor = totalClusters > 1 ? totalClusters - 1 : 1;
                const y = 1 - (i / divisor) * 2;
                const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
                const theta = phi * i;

                clusterCenters[clusterKeys] = new THREE.Vector3(
                    Math.cos(theta) * radiusAtY * radius,
                    y * radius,
                    Math.sin(theta) * radiusAtY * radius
                );
            }

            //성단 내부 노드 배치
            const currentCenter = clusterCenters[clusterKeys];
            const maxR = Math.sqrt(nodes.length) * 5;

            for (const node of nodes) {
                const u = Math.random() * 2 * Math.PI; // 0 ~ 360도
                const v = Math.acos(2 * Math.random() - 1); // 위아래 구면 각도
                const initR = maxR * Math.pow(Math.random(), 1 / 3);

                nodePosition[node] = new THREE.Vector3(
                    currentCenter.x + initR * Math.sin(v) * Math.cos(u),
                    currentCenter.y + initR * Math.sin(v) * Math.sin(u),
                    currentCenter.z + initR * Math.cos(v)
                );
            }

            // 시뮬레이션 (Relaxation): 노드 간 가중치를 거리에 반영
            const nodeSet = new Set(nodes);
            // 현재 클러스터 내부에 속한 엣지들만 싹 다 긁어옴
            const clusterEdges = edges.filter(e => nodeSet.has(e.u) && nodeSet.has(e.v));

            //척력및 인력 연산 반복
            const iterations = 50;

            for (let step = 0; step < iterations; step++) {
                // [인력/척력 적용]
                for (const edge of clusterEdges) {
                    const pU = nodePosition[edge.u];
                    const pV = nodePosition[edge.v];
                    if (!pU || !pV) continue;

                    const delta = pV.clone().sub(pU);
                    const currentDist = delta.length();
                    if (currentDist === 0) continue;

                    // 목표 거리 설정 (네 로직 응용: w에 비례 혹은 반비례)
                    // 예시: w가 작을수록(유사도가 높을수록) 거리가 짧아짐
                    const targetDist = (edge.w + 0.1) * (maxR * 0.4);

                    // 목표 거리와의 오차만큼 서로를 끌어당기거나 밀어냄
                    const force = (currentDist - targetDist) / currentDist;
                    const correction = delta.multiplyScalar(force * 0.3); // 0.3은 텐션(탄성) 조절값

                    pU.add(correction);
                    pV.sub(correction);
                }

                // 성단(maxR) 밖으로 튕겨 나간 놈들 멱살 잡고 원대복귀
                for (const node of nodes) {
                    const pos = nodePosition[node];
                    const offset = pos.clone().sub(currentCenter);
                    const dist = offset.length();

                    if (dist > maxR) {
                        offset.setLength(maxR);
                        nodePosition[node] = currentCenter.clone().add(offset);
                    } else if (dist < 1) {
                        // 중심부에 블랙홀처럼 너무 떡지는 것 방지
                        offset.setLength(1);
                        nodePosition[node] = currentCenter.clone().add(offset);
                    }
                }
            }
        }

        return { clusterCenter: clusterCenters, nodePosition: nodePosition };
    }, [clusters, edges]);

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

    return (
        <>
            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.05}

                maxDistance={500}
                minDistance={10}
            />

            <Points
                ref={pointsRef}
                positions={positions}
                colors={colors}
                stride={3}
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
            <Canvas camera={{ position: [0, 0, 150], fov: 60 }}>
                <Scene {...graph} />
            </Canvas>
        </div>
    );
}