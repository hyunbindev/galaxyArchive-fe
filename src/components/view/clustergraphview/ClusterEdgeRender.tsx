"use client";

import { useMemo } from "react";
import * as Three from "three";
import { ClusterEdge, ClusterNode } from "@/components/view/clustergraphview/type";

interface ClusterEdgeRenderProps {
    nodes: ClusterNode[];
    edges: ClusterEdge[];
    color: string;
}

export default function ClusterEdgeRender({ nodes, edges, color }: ClusterEdgeRenderProps) {
    const points = useMemo(() => {
        const positionById = new Map(nodes.map((node) => [node.id, node.position]));
        const coordinates: number[] = [];

        edges.forEach((edge) => {
            const source = positionById.get(edge.sourceId);
            const target = positionById.get(edge.targetId);
            if (!source || !target) return;

            coordinates.push(source.x, source.y, source.z, target.x, target.y, target.z);
        });

        return new Float32Array(coordinates);
    }, [edges, nodes]);

    if (points.length === 0) return null;

    return (
        <lineSegments>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[points, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
                color={new Three.Color(color)}
                transparent
                opacity={0.38}
                fog
            />
        </lineSegments>
    );
}
