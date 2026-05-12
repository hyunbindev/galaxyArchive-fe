"use client"
import {Node} from "@/components/view/@galaxyview/types";
import {useEffect, useMemo, useRef} from "react";

import * as THREE from "three"

interface NodesProps{
    nodes:Node[];
    nodeColor:THREE.Color;
}

export function NodesRender({nodes, nodeColor}:NodesProps){
    const meshRef = useRef<THREE.InstancedMesh>(null!);

    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const dummy = new THREE.Object3D();

        let index = 0;

        nodes.forEach((node) => {
            console.log(node);
            if (!node.position) return;

            dummy.position.set(
                node.position.x,
                node.position.y,
                node.position.z
            );

            dummy.updateMatrix();

            mesh.setMatrixAt(index, dummy.matrix);

            index++;
        });

        mesh.count = index;

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [nodes, nodeColor]);

    return(
        <instancedMesh
            ref={meshRef}
            args={[new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: nodeColor }), nodes.length]}
        />
    )
}