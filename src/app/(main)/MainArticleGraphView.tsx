"use client"

import useGetArticleGraph from "@/app/(main)/useGetArticleGraph";
import ArticleGraphView from "@/components/view/articlegraphview/ArticleGraphView";
import {cn} from "@/lib/utils";

interface MainArticleGraphViewProps {
    className?: string;
}

export default function MainArticleGraphView({className}:MainArticleGraphViewProps) {
    const { graph, } = useGetArticleGraph();
    return (
        <div className={cn("w-screen h-screen",className)}>
            <ArticleGraphView graph={ graph } />
        </div>
    );
}