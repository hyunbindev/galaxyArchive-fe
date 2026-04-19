"use client"

import useArticleGraph from "@/app/(main)/useArticleGraph";
import ArticleGraphView from "@/components/view/ArticleGraphView";

export default function MainArticleGraphView (){
    const { graph } = useArticleGraph()

    return(
        <>
        <ArticleGraphView graph={graph}/>
        </>
    )
}