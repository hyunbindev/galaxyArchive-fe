"use client"

import dynamic from "next/dynamic";
import useGetArticleGraph from "@/app/(main)/useGetArticleGraph";
import ArticleGraphView from "@/components/view/articlegraphview/ArticleGraphView";




export default function MainArticleGraphView() {
    const { graph, } = useGetArticleGraph();
    return (
        <div className="w-screen h-screen">
            <ArticleGraphView graph={ graph } />
        </div>
    );
}