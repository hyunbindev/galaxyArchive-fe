"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Vector3, type Mesh } from "three";
import { ClusterGroup, ClusterNode } from "@/components/view/clustergraphview/type";

interface ClusterNodeRenderProps {
    nodes: ClusterNode[];
    groups: ClusterGroup[];
    selectedNode: ClusterNode | null;
    selectedClusterId: number | null;
    onNodeSelect: (node: ClusterNode) => void;
    onClusterSelect: (clusterId: number) => void;
}

export default function ClusterNodeRender({
    nodes,
    groups,
    selectedNode,
    selectedClusterId,
    onNodeSelect,
    onClusterSelect,
}: ClusterNodeRenderProps) {
    const nodeMeshRefs = useRef(new Map<number, Mesh>());
    const targetPosition = useRef(new Vector3());
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
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
    const hoveredNode = useMemo(
        () => visibleNodes.find((node) => node.id === hoveredNodeId) ?? null,
        [hoveredNodeId, visibleNodes],
    );

    useFrame((_, delta) => {
        const alpha = 1 - Math.exp(-delta * 7);

        visibleNodes.forEach((node) => {
            const mesh = nodeMeshRefs.current.get(node.id);
            const group = groupById.get(node.clusterId);
            if (!mesh || !group) return;

            const expanded = selectedClusterId === node.clusterId;
            const target = expanded ? node.position : group.centroid;

            targetPosition.current.set(target.x, target.y, target.z);
            mesh.position.lerp(targetPosition.current, alpha);
        });
    });

    return (
        <group>
            {visibleGroups.map((group) => (
                <group key={group.clusterId}>
                    {selectedClusterId !== group.clusterId && (
                        <mesh
                            position={[group.centroid.x, group.centroid.y, group.centroid.z]}
                            onClick={(event) => {
                                event.stopPropagation();
                                onClusterSelect(group.clusterId);
                            }}
                        >
                            <sphereGeometry args={[Math.max(0.7, Math.min(1.5, group.articleCount * 0.04)), 24, 24]} />
                            <meshBasicMaterial color={group.color} transparent opacity={0.95} />
                        </mesh>
                    )}
                </group>
            ))}

            {visibleNodes.map((node) => {
                const selected = selectedNode?.id === node.id;
                const dimmed = selectedClusterId !== null && node.clusterId !== selectedClusterId;
                const radius = node.isNoise ? 0.4 : 0.55;

                return (
                    <mesh
                        key={node.id}
                        ref={(mesh) => {
                            if (mesh) {
                                nodeMeshRefs.current.set(node.id, mesh);
                            } else {
                                nodeMeshRefs.current.delete(node.id);
                            }
                        }}
                        position={[
                            groupById.get(node.clusterId)?.centroid.x ?? node.position.x,
                            groupById.get(node.clusterId)?.centroid.y ?? node.position.y,
                            groupById.get(node.clusterId)?.centroid.z ?? node.position.z,
                        ]}
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
                        />
                    </mesh>
                );
            })}

            {(hoveredNode || (selectedNode && !selectedNode.isNoise)) && (
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
