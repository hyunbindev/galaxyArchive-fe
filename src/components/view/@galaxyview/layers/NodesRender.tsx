"use client";

import { Node } from "@/components/view/@galaxyview/types";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface NodesProps {
    nodes: Node[];
    nodeColor: THREE.Color;
    selectedNodeColor : THREE.Color;
}

const SCALE = 80;
export function NodesRender({ nodes, nodeColor, selectedNodeColor }: NodesProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const hoveredIndex = useRef<number | null>(null);


    const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 16, 16), []);

    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;


        const dummy = new THREE.Object3D();
        nodes.forEach((node, i) => {
            if (!node.position) return;
            dummy.position.set(node.position.x, node.position.y, node.position.z);
            dummy.scale.set(SCALE, SCALE, SCALE);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            mesh.setColorAt(i,nodeColor)
        });

        mesh.instanceMatrix.needsUpdate = true;

        mesh.computeBoundingSphere();
    }, [nodes, nodeColor]);

    const updateInstance = (index: number, scale: number, color: THREE.Color) => {
        const mesh = meshRef.current;
        if (!mesh || !nodes[index]?.position) return;

        const dummy = new THREE.Object3D();
        const pos = nodes[index].position!;
        dummy.position.set(pos.x, pos.y, pos.z);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();

        mesh.setMatrixAt(index, dummy.matrix);
        mesh.setColorAt(index, color);

        mesh.instanceMatrix.needsUpdate = true;
        mesh.instanceColor!.needsUpdate = true;
    };

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const currentIndex = e.instanceId;
        if (currentIndex === undefined) return;

        if (hoveredIndex.current !== null && hoveredIndex.current !== currentIndex) {
            updateInstance(hoveredIndex.current, SCALE, nodeColor);
        }

        updateInstance(currentIndex, SCALE*1.5, selectedNodeColor);
        hoveredIndex.current = currentIndex;
    };

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, undefined, nodes.length]}
            onPointerDown={handlePointerDown}
        >
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    );
}