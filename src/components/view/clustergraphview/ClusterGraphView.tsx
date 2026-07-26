"use client";
import {MouseLeft, Move, ZoomIn, ZoomOut, MouseRight,} from "lucide-react";

import {Canvas} from "@react-three/fiber";
import {useMemo, useState} from "react";
import ClusterCameraController from "@/components/view/clustergraphview/ClusterCameraController";
import ClusterEdgeRender from "@/components/view/clustergraphview/ClusterEdgeRender";
import ClusterNodeRender from "@/components/view/clustergraphview/ClusterNodeRender";
import {ClusterNode, UserClusterSnapshot} from "@/components/view/clustergraphview/type";
import {toClusterScene} from "@/components/view/clustergraphview/toClusterScene";
import {cn} from "@/lib/utils";
import ClusterInfoPanel from "@/components/view/clustergraphview/ClusterInfoPanel";

interface ClusterGraphViewProps {
    snapshot: UserClusterSnapshot;
    className?: string;
}

export default function ClusterGraphView({snapshot, className}: ClusterGraphViewProps) {
    // API snapshot을 Three.js 렌더링에 쓰기 좋은 scene 데이터로 변환합니다.
    const scene = useMemo(() => toClusterScene(snapshot), [snapshot]);

    // 선택 상태는 기본 그래프와 확장 Dialog가 공유해야 하므로 상위에서 관리합니다.
    const [selectedNode, setSelectedNode] = useState<ClusterNode | null>(null);
    const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

    const selectedGroup = scene.groups.find((group) => group.clusterId === selectedClusterId) ?? null;

    // 클러스터 내부 연결선은 클러스터가 선택되었을 때만 보여줍니다.
    const visibleEdges = selectedClusterId === null ? []
        : scene.edges.filter((edge) => edge.clusterId === selectedClusterId);

    const visibleKeywordNodes = scene.keywordNodes.filter((node) => node.clusterId !== selectedClusterId);

    const handleNodeSelect = (node: ClusterNode) => {
        // 노드를 선택하면 해당 노드가 속한 클러스터도 함께 선택된 상태로 맞춥니다.
        setSelectedNode(node);
        setSelectedClusterId(node.clusterId);
    };

    return (
        <section className={cn("min-h-0 overflow-hidden", className)}>
            <div className="relative h-full min-h-0 overflow-hidden">
                <div className={cn("absolute text-xs select-none opacity-80 backdrop-blur-xs flex gap-5 font-light px-4 py-2 top-3 left-1/2 bg-background border border-accent rounded-sm -translate-x-1/2 z-2 transition-all duration-300 shrink-0",(selectedGroup !== null)&&"opacity-0 -translate-y-10" )}>
                    <span>{snapshot.clusters.filter((cluster)=>!cluster.isNoise).length} clusters</span>
                    <span>
                    {snapshot.clusters
                        .filter((cluster) => !cluster.isNoise)
                        .reduce((sum, cluster) => sum + cluster.articleCount, 0)} articles
                    </span>
                    <span>
                    {snapshot.clusters
                        .filter((cluster) => !cluster.isNoise)
                        .reduce((sum, cluster) => sum + cluster.articleCount-1, 0)} connections
                    </span>
                </div>
                <div className={cn("absolute text-xs select-none opacity-80 backdrop-blur-xs flex gap-5 font-light px-4 py-2 bottom-6 left-1/2 bg-background border border-accent rounded-sm -translate-x-1/2 z-2 transition-all duration-300  shrink-0",(selectedGroup !== null)&&"opacity-0 translate-y-10" )}>
                    <span className="flex gap-2 items-center"><MouseLeft size={18}/>click cluster</span>
                    <span className="flex gap-2 items-center"><MouseRight size={18}/> Drag with left mouse button</span>
                    <span className="flex gap-2 items-center"><Move size={18}/>drag screen</span>
                    <span className="flex gap-2 items-center">
                        <div className="flex">
                            <ZoomIn size={18}/>
                            <ZoomOut size={18}/>
                        </div>
                        scroll up, down
                    </span>
                </div>
                <ClusterInfoPanel
                    scene={scene}
                    selectedClusterId={selectedClusterId}
                    setSelectedClusterId={setSelectedClusterId}
                    visibleKeywordNodes={scene.keywordNodes}
                    selectedNode={selectedNode}
                    onNodeSelect={handleNodeSelect}
                />
                {/* 카메라가 바라볼 대상은 선택 노드가 우선이고, 없으면 선택 클러스터 중심입니다. */}
                <div className="h-full min-h-0 z-0">
                <ClusterGraphCanvas
                    scene={scene}
                    selectedNode={selectedNode}
                    selectedClusterId={selectedClusterId}
                    targetPosition={selectedNode?.position ?? selectedGroup?.centroid ?? null}
                    visibleEdges={visibleEdges}
                    visibleKeywordNodes={visibleKeywordNodes}
                    onNodeSelect={handleNodeSelect}
                    onClusterSelect={(clusterId) => {
                        setSelectedClusterId(clusterId);
                        setSelectedNode(null);
                    }}
                />
                </div>

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
    visibleKeywordNodes: ReturnType<typeof toClusterScene>["keywordNodes"];
    onNodeSelect: (node: ClusterNode) => void;
    onClusterSelect: (clusterId: number) => void;
}

function ClusterGraphCanvas({
    scene,
    selectedNode,
    selectedClusterId,
    targetPosition,
    visibleEdges,
    visibleKeywordNodes,
    onNodeSelect,
    onClusterSelect,
}: ClusterGraphCanvasProps) {
    return (
        <div className="relative h-full min-h-0 w-full">
            <Canvas gl={{antialias: true}} className="h-full w-full" dpr={[1, 1.75]}>
                <ClusterCameraController
                    bounds={scene.bounds}
                    targetPosition={targetPosition}
                />
                <ClusterEdgeRender nodes={scene.nodes} edges={visibleEdges} color="#6b7280"/>
                <ClusterNodeRender
                    nodes={scene.nodes}
                    keywordNodes={visibleKeywordNodes}
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
