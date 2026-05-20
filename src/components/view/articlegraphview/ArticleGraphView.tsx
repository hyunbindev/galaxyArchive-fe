"use client"

import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {Graph} from "@/components/view/articlegraphview/type";
import NodeRender from "@/components/view/articlegraphview/NodeRender";
import EdgeRender from "@/components/view/articlegraphview/EdgeRender";
import { useTheme } from "next-themes";
import {useEffect, useState} from "react";
import CameraController from "@/components/view/articlegraphview/CameraController";

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

            <CameraController/>

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