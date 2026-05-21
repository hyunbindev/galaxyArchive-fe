import {Edge, Node, Point3D} from "@/components/view/articlegraphview/type";
import { useMemo } from "react";
import * as Three from "three";

interface EdgeRenderProps{
    edges:Edge[];
    nodes:Node[];
    edgeColor:string;
}

export default function EdgeRender({ edges, nodes, edgeColor }:EdgeRenderProps){
    const points = useMemo(()=>{
        const nodePositionMap:Record<number, Point3D>={}

        nodes.forEach((node)=>{
            nodePositionMap[node.id] = node.position
            nodePositionMap[node.id] = node.position
        });

        const array = new Float32Array(edges.length * 6);

        edges.forEach((edge, i)=>{
            const offset = i*6;

            const up = nodePositionMap[edge.u.id];
            const vp = nodePositionMap[edge.v.id];

            // 시작점 (u)
            array[offset] = up.x;
            array[offset + 1] = up.y;
            array[offset + 2] = up.z;

            // 끝점 (v)
            array[offset + 3] = vp.x;
            array[offset + 4] = vp.y;
            array[offset + 5] = vp.z;

        })

        return array;
    },[edges,nodes]);

    return (
        <lineSegments>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[points, 3]} // 3개씩(X,Y,Z) 묶어서 좌표로 인식
                />
            </bufferGeometry>

            <lineBasicMaterial
                color={new Three.Color(edgeColor)}
                linewidth={1}
                transparent
                opacity={0.6}
            />

        </lineSegments>
    );


}