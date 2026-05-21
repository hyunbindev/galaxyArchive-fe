"use client"

import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {Graph} from "@/components/view/articlegraphview/type";
import NodeRender from "@/components/view/articlegraphview/NodeRender";
import EdgeRender from "@/components/view/articlegraphview/EdgeRender";
import { useTheme } from "next-themes";
import { useState } from "react";
import CameraController from "@/components/view/articlegraphview/CameraController";
import { Node } from "@/components/view/articlegraphview/type";
import {useRouter} from "next/navigation";

interface ArticleGraphViewProps{
    graph:Graph|null
}

export default function ArticleGraphView({ graph }: ArticleGraphViewProps) {
    const { resolvedTheme } = useTheme();
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const router = useRouter();

    if(!graph) return;

    const { nodes, edges } = graph;

    const isDark = resolvedTheme === "dark";
    const nodeColor = isDark ? "#c3c3c3" : "#404040";
    const edgeColor = isDark ? "#4e4e4e" : "#919191";
    const titleColor = isDark ? "white" : "black";

    const onNodeClickEvent = (node: Node) => {
        if(selectedNode == null || selectedNode.id != node.id){
            setSelectedNode(node);
            return;
        }
        if(selectedNode.id == node.id){
            router.push(`/article/${node.id}`)
        }
    };

    return (
        <Canvas gl={{ antialias: true }} className="w-full h-full">
            <CameraController targetPosition={selectedNode?.position} />]

            <OrbitControls />

            <NodeRender
                nodes={nodes}
                nodeColor={nodeColor}
                titleColor={titleColor}
                onNodeClickEvent={onNodeClickEvent}
                selectedNode={selectedNode}
            />

            <EdgeRender
                edges={edges}
                nodes={nodes}
                edgeColor={edgeColor}
            />
        </Canvas>
    );
}