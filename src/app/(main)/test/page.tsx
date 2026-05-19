"use client"

import useGetArticleGraph from "@/app/(main)/test/useGetArticleGraph";
import ArticleGraphView from "@/components/view/articlegraphview/ArticleGraphView";


export default function test (){
    const { data, loading, error } = useGetArticleGraph();
    return(
        <div className={"w-screen h-screen"}>
            <ArticleGraphView graph={data}/>
        </div>
    )
}