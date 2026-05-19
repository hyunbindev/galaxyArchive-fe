import { useState, useEffect } from 'react';
import lightApi from "@/lib/ApiClient";
import { ArticleGraph } from "@/components/view/graphview/ArticleGraphView";
import {Graph} from "@/components/view/articlegraphview/type";

export default function useGetArticleGraph() {
    const [data, setData] = useState<Graph | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown | null>(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                setLoading(true);
                const res = await lightApi.get<Graph>('/api/v1/articles/graphs');

                setData(res);
            } catch (e) {
                console.error("그래프 데이터 로딩 실패:", e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    return { data, loading, error };
}