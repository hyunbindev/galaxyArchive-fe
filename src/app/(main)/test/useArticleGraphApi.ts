import {Cluster, Edge, Graph, Node} from "@/components/view/@galaxyview/types";
import {useEffect, useState} from "react";


interface ApiInterface{
    clusters:Record<string, number[]>
    edges:{ u_title:string, v_title:string, u:number, v:number, w:number }[]
}


export default function useArticleGraphApi() {
    const [graph, setGraph] = useState<Graph | null>(null);

    const getClusters = async () => {
        const res = await fetch(`/api/v1/articles/graphs`);
        const rawData: ApiInterface = await res.json();

        const clusters: Cluster[] = Object.entries(rawData.clusters).map(
            ([name, nodeIds]) => ({
                name,
                nodeIds,
            })
        );

        const edges: Edge[] = rawData.edges;

        const nodes:Node[] = [];

        const nodeMap:Record<number,string> = {};

        rawData.edges.forEach(({u_title, v_title, u, v})=>{
            nodeMap[u] = u_title;
            nodeMap[v] = v_title;
        });

        Object.entries(nodeMap).forEach(([id,title])=>{
            nodes.push({id:Number(id),title:title})
        })

        setGraph({
            nodes: nodes,
            edges: edges,
            clusters: clusters,
        });
    };

    useEffect(() => {
        getClusters();
    }, []);

    return { graph, getClusters };
}