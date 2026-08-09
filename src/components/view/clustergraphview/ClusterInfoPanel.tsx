"use client"
import {cn, dateConvert} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {ClusterKeywordNode, ClusterNode} from "@/components/view/clustergraphview/type";
import {Eye, MessageSquare, X} from "lucide-react";
import useGetClusterArticleSummary from "@/components/view/clustergraphview/useGetClusterArticleSummary";

import {toClusterScene} from "@/components/view/clustergraphview/toClusterScene";
import {useEffect} from "react";
import {useRouter} from "next/navigation";


interface ClusterInfoPanelProps{
    scene: ReturnType<typeof toClusterScene>;
    className?: string;
    selectedClusterId:number|null;
    setSelectedClusterId: (node: number|null) => void;
    visibleKeywordNodes:ClusterKeywordNode[];
    selectedNode:ClusterNode|null;
    onNodeSelect: (node: ClusterNode) => void;
}

export default function ClusterInfoPanel({scene, onNodeSelect, className,selectedClusterId, setSelectedClusterId, visibleKeywordNodes, selectedNode}:ClusterInfoPanelProps){
    const articleSummary = useGetClusterArticleSummary(selectedClusterId);

    const router = useRouter();
    const selectNode = (articleId:number)=>{
        const node = scene.nodes.find((node)=>node.id === articleId);

        if(!node) return;

        onNodeSelect(node);
    }

    const navigateArticle = (articleId:number) =>{
        if(selectedNode?.id !== articleId) return;
        router.push(`/article/${articleId}`)
    }

    useEffect(() => {
        if (!selectedNode?.id) return;
        if (selectedNode.clusterId !== selectedClusterId) return;


        document
            .getElementById(`cluster-article-${selectedNode.id}`)
            ?.scrollIntoView({block: "nearest", behavior: "smooth"});
    }, [selectedNode?.id, selectedNode?.clusterId, selectedClusterId, articleSummary]);

    if(selectedClusterId === null){
        return null;
    }

    return(
        <aside className={cn("absolute right-0 p-5 flex h-full justify-start",className)}>
            <div className="border border-accent flex flex-col px-3 rounded-sm w-100 h-full p-2 bg-background/70 backdrop-blur-md z-2">
                <div className="flex justify-between py-2">
                    <span>Cluster</span>
                    <button className="cursor-pointer" type="button" onClick={()=> {setSelectedClusterId(null)}} aria-label="close">
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex gap-2 py-2">
                    {visibleKeywordNodes
                        .filter((keyword)=> keyword.clusterId === selectedClusterId)
                        .map((keyword)=>(<Badge key={keyword.keyword} className="text-xs py-0.5 text-muted-foreground" variant="outline">{keyword.keyword}</Badge>))}
                </div>

                <ul className="flex flex-col gap-2 overflow-y-scroll no-scrollbar">
                    {articleSummary.map((summary)=>(
                        <li id={`cluster-article-${summary.id}`} onClick={()=> {
                            selectNode(summary.id);
                            navigateArticle(summary.id);
                        }} key={summary.id} className={cn("border border-accent flex flex-col gap-1 rounded-sm p-3 select-none cursor-pointer hover:bg-secondary transition-all duration-500",(summary.id === selectedNode?.id) && "bg-secondary")}>

                            <div className="flex justify-between items-center">
                                <h2 className="text-sm">{summary.title}</h2>
                                <span className="text-xs text-muted-foreground">{dateConvert(summary.createdAt)}</span>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground wrap-break-word px-0.5">{summary.description}...</p>
                            </div>

                            <div className="flex flex-col justify-between gap-2 pt-1">

                                <div className="flex flex-wrap gap-1">
                                    {summary.keywords.map((keyword)=>(
                                        <Badge
                                            key={keyword}
                                            className="text-xs text-muted-foreground truncate"
                                            variant="outline">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>

                                {summary.id === selectedNode?.id &&
                                <div className="flex justify-start border-t border-accent gap-5 pt-2 px-2">
                                    <div className="flex text-muted-foreground items-center">
                                        <MessageSquare size={12} className="stroke-current mr-1.5"/>
                                        <span className="text-xs">{summary.commentsCount}</span>
                                    </div>
                                    <div className="flex text-muted-foreground items-center">
                                        <Eye size={12} className="stroke-current mr-1.5"/>
                                        <span className="text-xs">{summary.viewCount}</span>
                                    </div>
                                </div>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
