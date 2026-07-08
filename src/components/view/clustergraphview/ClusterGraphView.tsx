"use client";

import {Canvas} from "@react-three/fiber";
import {useMemo, useState} from "react";
import {Focus, Layers3} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import ClusterCameraController from "@/components/view/clustergraphview/ClusterCameraController";
import ClusterEdgeRender from "@/components/view/clustergraphview/ClusterEdgeRender";
import ClusterNodeRender from "@/components/view/clustergraphview/ClusterNodeRender";
import {ClusterNode, UserClusterSnapshot} from "@/components/view/clustergraphview/type";
import {toClusterScene} from "@/components/view/clustergraphview/toClusterScene";
import {cn} from "@/lib/utils";

interface ClusterGraphViewProps {
    snapshot: UserClusterSnapshot;
    className?: string;
}

export default function ClusterGraphView({snapshot, className}: ClusterGraphViewProps) {
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
        <section className={cn("flex min-h-0 flex-1 overflow-hidden bg-background border border-accent rounded-md", className)}>
            <div className="relative h-full min-h-0 flex-1">
                <ClusterGraphCanvas
                    scene={scene}
                    selectedNode={selectedNode}
                    selectedClusterId={selectedClusterId}
                    targetPosition={selectedNode?.position ?? selectedGroup?.centroid ?? null}
                    visibleEdges={visibleEdges}
                    onNodeSelect={handleNodeSelect}
                    onClusterSelect={(clusterId) => {
                        setSelectedClusterId(clusterId);
                        setSelectedNode(null);
                    }}
                />

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-5 top-5 z-10 bg-background/90 shadow-sm backdrop-blur transition-transform hover:scale-105"
                        >
                            <Focus className="size-4"/>
                            <span className="sr-only">Expand cluster graph</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="h-[92vh] w-[96vw] max-w-none gap-0 overflow-hidden p-0 sm:max-w-none">
                        <DialogTitle className="sr-only">Expanded cluster graph</DialogTitle>
                        <ClusterGraphCanvas
                            scene={scene}
                            selectedNode={selectedNode}
                            selectedClusterId={selectedClusterId}
                            targetPosition={selectedNode?.position ?? selectedGroup?.centroid ?? null}
                            visibleEdges={visibleEdges}
                            onNodeSelect={handleNodeSelect}
                            onClusterSelect={(clusterId) => {
                                setSelectedClusterId(clusterId);
                                setSelectedNode(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}

interface ClusterGraphCanvasProps {
    scene: ReturnType<typeof toClusterScene>;
    selectedNode: ClusterNode | null;
    selectedClusterId: number | null;
    targetPosition: ClusterNode["position"] | null;
    visibleEdges: ReturnType<typeof toClusterScene>["edges"];
    onNodeSelect: (node: ClusterNode) => void;
    onClusterSelect: (clusterId: number) => void;
}

function ClusterGraphCanvas({
    scene,
    selectedNode,
    selectedClusterId,
    targetPosition,
    visibleEdges,
    onNodeSelect,
    onClusterSelect,
}: ClusterGraphCanvasProps) {
    return (
        <div className="relative h-full min-h-0 w-full">
            <div
                className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-md border bg-background/90 px-3 py-2 text-sm shadow-sm backdrop-blur">
                <Layers3 className="size-4"/>
                <span>{scene.clusterCount} clusters</span>
                <span className="text-muted-foreground">{scene.articleCount} articles</span>
            </div>

            <Canvas gl={{antialias: true}} className="h-full w-full" dpr={[1, 1.75]}>
                <ClusterCameraController
                    bounds={scene.bounds}
                    targetPosition={targetPosition}
                />
                <ClusterEdgeRender nodes={scene.nodes} edges={visibleEdges} color="#6b7280"/>
                <ClusterNodeRender
                    nodes={scene.nodes}
                    groups={scene.groups}
                    selectedNode={selectedNode}
                    selectedClusterId={selectedClusterId}
                    onNodeSelect={onNodeSelect}
                    onClusterSelect={onClusterSelect}
                />
            </Canvas>
        </div>
    );
}
