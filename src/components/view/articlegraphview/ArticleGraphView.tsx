"use client"

import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {Graph} from "@/components/view/articlegraphview/type";
import NodeRender from "@/components/view/articlegraphview/NodeRender";
import EdgeRender from "@/components/view/articlegraphview/EdgeRender";
import { useTheme } from "next-themes";
import {useEffect, useState} from "react";

interface ArticleGraphViewProps{
    graph:Graph|null
}

export default function ArticleGraphView({ graph }:ArticleGraphViewProps){
    if(!graph) return;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const [selectedNode, setSelectedNode] =useState<number|null>(null);

    //로드중 스켈레톤등
    if (!mounted) return null;

    const {clusters, nodes, edges} = graph

    const isDark = resolvedTheme === "dark";

    const nodeColor = isDark ?  "#c3c3c3" : "#404040";
    const edgeColor = isDark? "#4e4e4e" : "#919191"
    const titleColor = isDark? "white" : "black"

    const onNodeClickEvent = (nodeId:number)=>{
        setSelectedNode(nodeId);
        console.log(selectedNode)
    }


    return(
        <Canvas gl={{ antialias: true }} className="w-full h-full">

            <PerspectiveCamera
                makeDefault
                fov={45}                // 화각 (값이 클수록 광각렌즈처럼 원근감이 강해짐)
                near={0.1}              // 카메라가 볼 수 있는 가장 가까운 거리
                far={5000}              // 카메라가 볼 수 있는 가장 먼 거리
                position={[60, 60, 60]}
            />

            <OrbitControls />

            <NodeRender
                nodes={nodes}
                nodeColor={nodeColor}
                titleColor={titleColor}
                onNodeClickEvent={onNodeClickEvent}
            />

            <EdgeRender
                edges={edges}
                nodes={nodes}
                edgeColor={edgeColor}
            />
        </Canvas>

    )
}