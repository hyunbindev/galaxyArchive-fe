"use client"

import useArticleGraph from "@/app/(main)/useArticleGraph";
import ArticleGraphView from "@/components/view/graphview/ArticleGraphView";

export default function MainArticleGraphView (){
    const { graph } = useArticleGraph()

    return(
        <>
            <ArticleGraphView graph={graph}/>
        </>
    )
}