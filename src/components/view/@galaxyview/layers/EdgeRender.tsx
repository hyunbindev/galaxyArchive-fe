"use client"
import { useMemo } from "react";
import * as THREE from "three";
import { Edge, Point3D } from "@/components/view/@galaxyview/types";

interface EdgesProps {
    edges: Edge[];
    nodePosition: Record<number, Point3D>;
    edgeColor: THREE.Color;
}

export function EdgesRender({ edges, nodePosition, edgeColor }: EdgesProps) {

    const positions = useMemo(() => {
        const posArray = new Float32Array(edges.length * 2 * 3);
        let index = 0;

        edges.forEach((edge) => {
            const uPosition = nodePosition[edge.u];
            const vPosition = nodePosition[edge.v];

            if (uPosition && vPosition) {
                posArray[index++] = uPosition.x;
                posArray[index++] = uPosition.y;
                posArray[index++] = uPosition.z;

                posArray[index++] = vPosition.x;
                posArray[index++] = vPosition.y;
                posArray[index++] = vPosition.z;
            }
        });
        return posArray;
    }, [edges, nodePosition,edgeColor]);


    const handleGeometryUpdate = (self: THREE.BufferGeometry) => {
        self.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        self.attributes.position.needsUpdate = true;
        self.computeBoundingSphere();
    };

    return (
        <lineSegments>
            <bufferGeometry onUpdate={handleGeometryUpdate} />
            <lineBasicMaterial color={edgeColor} transparent opacity={0.4} />
        </lineSegments>
    );
}