"use client";

import {Canvas} from "@react-three/fiber";
import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {ExternalLink, Focus, Layers3, LocateFixed, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import ClusterCameraController from "@/components/view/clustergraphview/ClusterCameraController";
import ClusterEdgeRender from "@/components/view/clustergraphview/ClusterEdgeRender";
import ClusterNodeRender from "@/components/view/clustergraphview/ClusterNodeRender";
import {ClusterNode, UserClusterSnapshot} from "@/components/view/clustergraphview/type";
import {toClusterScene} from "@/components/view/clustergraphview/toClusterScene";
import {cn, dateConvert} from "@/lib/utils";

interface ClusterGraphViewProps {
    snapshot: UserClusterSnapshot;
    className?: string;
}

export default function ClusterGraphView({snapshot, className}: ClusterGraphViewProps) {
    const router = useRouter();
    const scene = useMemo(() => toClusterScene(snapshot), [snapshot]);
    const [selectedNode, setSelectedNode] = useState<ClusterNode | null>(null);
    const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

    const selectedGroup = scene.groups.find((group) => group.clusterId === selectedClusterId) ?? null;
    const visibleEdges = selectedClusterId === null
        ? []
        : scene.edges.filter((edge) => edge.clusterId === selectedClusterId);

    const handleNodeSelect = (node: ClusterNode) => {
        setSelectedNode(node);
        setSelectedClusterId(node.clusterId);
    };

    return (
        <section
            className={cn("grid min-h-[620px] overflow-hidden bg-background", className)}>
            <div className="relative">
                <div
                    className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-md border bg-background/90 px-3 py-2 text-sm shadow-sm backdrop-blur">
                    <Layers3 className="size-4"/>
                    <span>{scene.clusterCount} clusters</span>
                    <span className="text-muted-foreground">{scene.articleCount} articles</span>
                </div>

                <Canvas gl={{antialias: true}} dpr={[1, 1.75]}>

                    <ambientLight intensity={0.55}/>
                    <directionalLight position={[80, 120, 80]} intensity={1.1}/>
                    <ClusterCameraController
                        bounds={scene.bounds}
                        targetPosition={selectedNode?.position ?? selectedGroup?.centroid ?? null}
                    />
                    <ClusterEdgeRender nodes={scene.nodes} edges={visibleEdges} color="#6b7280"/>
                    <ClusterNodeRender
                        nodes={scene.nodes}
                        groups={scene.groups}
                        selectedNode={selectedNode}
                        selectedClusterId={selectedClusterId}
                        onNodeSelect={handleNodeSelect}
                        onClusterSelect={(clusterId) => {
                            setSelectedClusterId(clusterId);
                            setSelectedNode(null);
                        }}
                    />
                </Canvas>
            </div>
        </section>
    );
}

function Metric({label, value}: { label: string; value: string }) {
    return (
        <div className="rounded-md border px-3 py-2">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 font-mono text-sm">{value}</div>
        </div>
    );
}

function formatScore(value: number | null) {
    if (value === null || value === undefined) return "-";
    return value.toFixed(3);
}
