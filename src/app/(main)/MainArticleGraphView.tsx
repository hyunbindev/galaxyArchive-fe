"use client"

import useArticleGraph from "@/app/(main)/useArticleGraph";
import ArticleGraphView from "@/components/view/ArticleGraphView";

export default function MainArticleGraphView (){
    const { edges } = useArticleGraph()

    return(
        <ArticleGraphView edges={edges}/>
    )
}