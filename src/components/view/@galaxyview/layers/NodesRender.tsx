import {Node} from "@/components/view/@galaxyview/types";
import {useEffect, useMemo, useRef} from "react";

import * as THREE from "three"

interface NodesProps{
    nodes:Node[];
    nodeColor:THREE.Color;
}

export function NodesRender({nodes, nodeColor}:NodesProps){
    const meshRef = useRef<THREE.InstancedMesh>(null!);

    useEffect(()=>{
        const mesh = meshRef.current;
        const dummy = new THREE.Object3D();

        nodes.forEach(({id,title,position},i)=>{
            if(!position) return;

            dummy.position.set(position.x, position.y, position.z);
            dummy.updateMatrix();

            mesh.setMatrixAt(i,dummy.matrix);

            mesh.setColorAt(i, nodeColor || new THREE.Color("white"));
        });

        mesh.instanceMatrix.needsUpdate = true;
        if(mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    },[nodes]);

    return(
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, nodes.length]}
        >
            <sphereGeometry args={[0.3, 8, 8]}/>
        </instancedMesh>
    )
}