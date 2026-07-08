"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { AdditiveBlending, CanvasTexture, Vector3, type Mesh } from "three";
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
    const glowTextures = useMemo(
        () => new Map(visibleGroups.map((group) => [group.clusterId, makeRadialTexture(group.color)])),
        [visibleGroups],
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
                    <sprite
                        position={[group.centroid.x, group.centroid.y, group.centroid.z]}
                        scale={[
                            Math.max(10.5, Math.min(15, group.articleCount * 0.32)),
                            Math.max(10.5, Math.min(15, group.articleCount * 0.32)),
                            1,
                        ]}
                    >
                        <spriteMaterial
                            map={glowTextures.get(group.clusterId)}
                            transparent
                            opacity={selectedClusterId === group.clusterId ? 1 : 0.72}
                            depthWrite={false}
                            blending={AdditiveBlending}
                        />
                    </sprite>
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
                            fog
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

function makeRadialTexture(color: string) {
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
