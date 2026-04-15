"use client"
import {useEffect, useState} from "react";
import {ArticleEdge} from "@/components/view/ArticleGraphView";

export default function useArticleGraph (){
    const [edges,setEdge] = useState<ArticleEdge[]>([]);

    useEffect(()=>{
        const loadData = async () => {
            const res =  await getEdges();
            setEdge(res);
        };
        loadData()
    },[])

    const getEdges = async()=>{
        const res = await fetch(`/api/v1/articles/graphs`);
        const data: ArticleEdge[] = await res.json();
        return data;
    }

    return { edges }
}