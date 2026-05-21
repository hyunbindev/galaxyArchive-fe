"use client"
import {useEffect, useState} from 'react';
import lightApi from "@/lib/ApiClient";
import { Graph } from "@/components/view/articlegraphview/type";

export default function useGetArticleGraph() {

    const [graph, setGraph] = useState<Graph|null>(null);

    useEffect(()=>{
        (async()=>{
        const res = await lightApi.get<Graph>('/api/v1/articles/graphs')
            .baseUrl(process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL);
        setGraph(res);
        })();
    },[])

    return { graph };
}