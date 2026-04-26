"use client"
import {useEffect, useState} from "react";
import { ArticleGraph } from "@/components/view/graphview/ArticleGraphView";

export default function useArticleGraph (){
    const [graph,setGraph] = useState<ArticleGraph>();

    useEffect(()=>{
        const loadData = async () => {
            const res =  await getEdges();
            setGraph(res);
        };
        loadData()
    },[])

    const getEdges = async()=>{
        const res = await fetch(`/api/v1/articles/graphs`);
        const data: ArticleGraph = await res.json();

        return data;
    }

    return { graph }
}