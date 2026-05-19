"use client"

import { useEffect, useRef } from "react"
import * as Three from "three"
import { Node } from "@/components/view/articlegraphview/type";


interface NodeRenderProp{
    nodes:Node[];
    nodeColor:Three.Color;
}

export default function NodeRender({nodes, nodeColor}:NodeRenderProp){
    const meshRef = useRef<Three.InstancedMesh>(null!);

    useEffect(()=>{
        const mesh = meshRef.current;
        if(!mesh) return;

        const dummy = new Three.Object3D();

        for(let index = 0; index<nodes.length; index++){
            const nodePosition = nodes[index].position
            if(!nodePosition)return;

            dummy.position.set(
                nodePosition.x,
                nodePosition.y,
                nodePosition.z,
            );

            dummy.updateMatrix();

            mesh.setMatrixAt(index, dummy.matrix);
        }
        mesh.count = nodes.length-1;

        mesh.instanceMatrix.needsUpdate = true;
        if(mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    },[nodes, nodeColor]);

    return(
        <instancedMesh
            ref={meshRef}
            args={[new Three.SphereGeometry(1, 32, 32), new Three.MeshBasicMaterial({ color: nodeColor }), nodes.length]}
        />
    )
}