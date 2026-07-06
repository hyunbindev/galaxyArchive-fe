"use client";

import { Html } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as Three from "three";
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
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
    const hoveredNode = useMemo(
        () => nodes.find((node) => node.id === hoveredNodeId) ?? null,
        [hoveredNodeId, nodes],
    );

    return (
        <group>
            {groups.map((group) => (
                <Html
                    key={group.clusterId}
                    position={[group.centroid.x, group.centroid.y + 7, group.centroid.z]}
                    center
                    distanceFactor={110}
                    occlude={false}
                >
                    <button
                        type="button"
                        onClick={() => onClusterSelect(group.clusterId)}
                        className="flex min-w-18 items-center justify-center gap-1 rounded-md border bg-background/85 px-2 py-1 text-[11px] shadow-sm backdrop-blur transition hover:bg-accent"
                    >
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: group.color }}
                        />
                        <span>{group.isNoise ? "Noise" : `C${group.label}`}</span>
                        <span className="text-muted-foreground">{group.articleCount}</span>
                    </button>
                </Html>
            ))}

            {nodes.map((node) => {
                const selected = selectedNode?.id === node.id;
                const dimmed = selectedClusterId !== null && node.clusterId !== selectedClusterId;
                const radius = node.isNoise ? 1.2 : 1.7;

                return (
                    <mesh
                        key={node.id}
                        position={[node.position.x, node.position.y, node.position.z]}
                        scale={selected ? 1.65 : 1}
                        onPointerOver={(event) => {
                            event.stopPropagation();
                            setHoveredNodeId(node.id);
                        }}
                        onPointerOut={() => setHoveredNodeId(null)}
                        onClick={(event) => {
                            event.stopPropagation();
                            onNodeSelect(node);
                        }}
                    >
                        <sphereGeometry args={[radius, 24, 24]} />
                        <meshStandardMaterial
                            color={node.color}
                            roughness={0.55}
                            metalness={0.08}
                            emissive={new Three.Color(selected ? node.color : "#000000")}
                            emissiveIntensity={selected ? 0.26 : 0}
                            transparent
                            opacity={dimmed ? 0.18 : 0.92}
                        />
                    </mesh>
                );
            })}

            {(hoveredNode || selectedNode) && (
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
                    <div className="rounded-md border bg-background/95 px-2.5 py-1.5 text-xs shadow-md backdrop-blur">
                        <div className="line-clamp-2 font-medium">{(hoveredNode ?? selectedNode)!.title}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {(hoveredNode ?? selectedNode)!.isNoise ? "Noise" : `Cluster ${(hoveredNode ?? selectedNode)!.label}`}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}
