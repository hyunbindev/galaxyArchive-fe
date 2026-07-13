"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { AdditiveBlending, CanvasTexture, Vector3, type Group } from "three";
import { ClusterGroup, ClusterKeywordNode, ClusterNode } from "@/components/view/clustergraphview/type";

interface ClusterNodeRenderProps {
    nodes: ClusterNode[];
    keywordNodes: ClusterKeywordNode[];
    groups: ClusterGroup[];
    selectedNode: ClusterNode | null;
    selectedClusterId: number | null;
    onNodeSelect: (node: ClusterNode) => void;
    onClusterSelect: (clusterId: number) => void;
}

export default function ClusterNodeRender({
    nodes,
    keywordNodes,
    groups,
    selectedNode,
    selectedClusterId,
    onNodeSelect,
    onClusterSelect,
}: ClusterNodeRenderProps) {
    // useFrame에서 각 노드 mesh 위치를 직접 움직이기 위해 id별 ref를 저장합니다.
    const nodeGroupRefs = useRef(new Map<number, Group>());
    const targetPosition = useRef(new Vector3());
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

    // noise 클러스터/노드는 화면 렌더링 대상에서 제외합니다.
    const visibleGroups = useMemo(
        () => groups.filter((group) => !group.isNoise),
        [groups],
    );
    const visibleNodes = useMemo(
        () => nodes.filter((node) => !node.isNoise),
        [nodes],
    );
    const groupById = useMemo(
        () => new Map(visibleGroups.map((group) => [group.clusterId, group])),
        [visibleGroups],
    );

    // hover 상태는 id만 저장하고, 실제 표시할 node 객체는 현재 visibleNodes에서 다시 찾습니다.
    const hoveredNode = useMemo(
        () => visibleNodes.find((node) => node.id === hoveredNodeId) ?? null,
        [hoveredNodeId, visibleNodes],
    );

    // 클러스터별 glow sprite에 사용할 radial texture를 클러스터 색상으로 미리 생성합니다.
    const glowTextures = useMemo(
        () => new Map(visibleGroups.map((group) => [group.clusterId, makeRadialTexture(group.color)])),
        [visibleGroups],
    );

    // 노드별 glow sprite는 선택된 클러스터가 펼쳐졌을 때 각 노드 뒤에 붙여 사용합니다.
    const nodeGlowScale = 10;

    useFrame((_, delta) => {
        // 프레임 간격이 달라도 비슷한 속도로 보이도록 delta 기반 보간 계수를 계산합니다.
        const alpha = 1 - Math.exp(-delta * 7);

        visibleNodes.forEach((node) => {
            const nodeGroup = nodeGroupRefs.current.get(node.id);
            const group = groupById.get(node.clusterId);
            if (!nodeGroup || !group) return;

            const expanded = selectedClusterId === node.clusterId;

            // 선택된 클러스터의 노드는 원래 위치로 퍼지고, 나머지는 클러스터 중심에 모입니다.
            const target = expanded ? node.position : group.centroid;

            targetPosition.current.set(target.x, target.y, target.z);
            nodeGroup.position.lerp(targetPosition.current, alpha);
        });
    });

    return (
        <group>
            {visibleGroups.map((group) => (
                <group key={group.clusterId}>
                    {selectedClusterId !== group.clusterId && (
                        // 클러스터 중심에 부드러운 glow를 깔아 클러스터 덩어리의 위치를 보여줍니다.
                        <sprite
                            position={[group.centroid.x, group.centroid.y, group.centroid.z]}
                            scale={[
                                group.articleCount * 5,
                                group.articleCount * 5,
                                1,
                            ]}
                        >
                            <spriteMaterial
                                map={glowTextures.get(group.clusterId)}
                                transparent
                                opacity={0.72}
                                depthWrite={false}
                                blending={AdditiveBlending}
                            />
                        </sprite>
                    )}
                    {selectedClusterId !== group.clusterId && (
                        <mesh
                            position={[group.centroid.x, group.centroid.y, group.centroid.z]}
                            onClick={(event) => {
                                event.stopPropagation();
                                onClusterSelect(group.clusterId);
                            }}
                        >
                            <sphereGeometry args={[Math.max(0.7, Math.min(1.5, group.articleCount * 0.04)), 24, 24]} />
                            <meshBasicMaterial color={group.color} transparent opacity={0.95} fog />
                        </mesh>
                    )}
                </group>
            ))}

            {keywordNodes.map((keywordNode) => (
                <group
                    key={keywordNode.id}
                    position={[
                        keywordNode.position.x,
                        keywordNode.position.y,
                        keywordNode.position.z,
                    ]}
                >
                    <Html
                        position={[0, 1.15, 0]}
                        center
                        distanceFactor={95}
                        occlude={false}
                    >
                        <div>
                            {keywordNode.keyword}
                        </div>
                    </Html>
                </group>
            ))}

            {visibleNodes.map((node) => {
                // 선택된 노드는 크게, 선택되지 않은 다른 클러스터의 노드는 흐리게 표시합니다.
                const selected = selectedNode?.id === node.id;
                const dimmed = selectedClusterId !== null && node.clusterId !== selectedClusterId;
                const expanded = selectedClusterId === node.clusterId;
                const radius = node.isNoise ? 0.4 : 0.55;

                return (
                    <group
                        key={node.id}
                        ref={(nodeGroup) => {
                            if (nodeGroup) {
                                nodeGroupRefs.current.set(node.id, nodeGroup);
                            } else {
                                nodeGroupRefs.current.delete(node.id);
                            }
                        }}
                        position={[
                            // 최초 렌더링 시에는 클러스터 중심에서 시작하고 useFrame에서 목표 위치로 이동합니다.
                            groupById.get(node.clusterId)?.centroid.x ?? node.position.x,
                            groupById.get(node.clusterId)?.centroid.y ?? node.position.y,
                            groupById.get(node.clusterId)?.centroid.z ?? node.position.z,
                        ]}
                    >
                        {expanded && (
                            // 클러스터가 선택되어 노드가 펼쳐졌을 때 각 노드 뒤에 작은 glow를 표시합니다.
                            <sprite
                                scale={[
                                    selected ? nodeGlowScale * 1.35 : nodeGlowScale,
                                    selected ? nodeGlowScale * 1.35 : nodeGlowScale,
                                    1,
                                ]}
                            >
                                <spriteMaterial
                                    map={glowTextures.get(node.clusterId)}
                                    transparent
                                    opacity={selected ? 0.86 : 0.48}
                                    depthWrite={false}
                                    blending={AdditiveBlending}
                                />
                            </sprite>
                        )}
                        <mesh
                            scale={selected ? 1.45 : 1}
                            onPointerOver={(event) => {
                                event.stopPropagation();
                                if (selectedClusterId === node.clusterId) {
                                    setHoveredNodeId(node.id);
                                }
                            }}
                            onPointerOut={() => setHoveredNodeId(null)}
                            onClick={(event) => {
                                event.stopPropagation();
                                if (selectedClusterId === node.clusterId) {
                                    onNodeSelect(node);
                                } else {
                                    onClusterSelect(node.clusterId);
                                }
                            }}
                        >
                            <sphereGeometry args={[radius, 24, 24]} />
                            <meshBasicMaterial
                                color={node.color}
                                transparent
                                opacity={dimmed ? 0.18 : selected ? 1 : 0.92}
                                fog
                            />
                        </mesh>
                    </group>
                );
            })}

            {(hoveredNode || (selectedNode && !selectedNode.isNoise)) && (
                // hover 중인 노드가 있으면 hover가 우선이고, 없으면 선택된 노드 라벨을 보여줍니다.
                <Html
                    position={[
                        (hoveredNode ?? selectedNode)!.position.x,
                        (hoveredNode ?? selectedNode)!.position.y + 5,
                        (hoveredNode ?? selectedNode)!.position.z,
                    ]}
                    center
                    distanceFactor={95}
                    occlude={false}
                >
                    <div className="max-w-80 rounded-md border bg-background/95 px-2.5 py-1.5 text-xs shadow-md backdrop-blur">
                        <div className="whitespace-normal break-words font-medium">{(hoveredNode ?? selectedNode)!.title}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {(hoveredNode ?? selectedNode)!.isNoise ? "Noise" : `Cluster ${(hoveredNode ?? selectedNode)!.label}`}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

function makeRadialTexture(color: string) {
    // spriteMaterial에 넣을 canvas texture를 만들어 클러스터 glow 효과로 사용합니다.
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) {
        return new CanvasTexture(canvas);
    }

    const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
    );

    gradient.addColorStop(0, toRgba(color, 0.72));
    gradient.addColorStop(0.28, toRgba(color, 0.34));
    gradient.addColorStop(0.68, toRgba(color, 0.1));
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return new CanvasTexture(canvas);
}

function toRgba(hex: string, alpha: number) {
    const value = hex.replace("#", "");
    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
