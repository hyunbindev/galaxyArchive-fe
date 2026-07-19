import { useEffect, useState } from "react";
import { ArticleSummary } from "@/app/(main)/user/[id]/article/useGetNewArticleList";
import lightApi from "@/lib/ApiClient";

export default function useGetClusterArticleSummary(clusterId: number | null) {
    const [articleSummary, setArticleSummary] = useState<ArticleSummary[]>([]);

    useEffect(() => {
        if (clusterId === null) {
            setArticleSummary([]);
            return;
        }
        let ignore = false;
        (async () => {
            const res = await lightApi
                .get<ArticleSummary[]>(`/api/v1/clusters/${clusterId}`)
                .baseUrl(process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL);

            if (!ignore) {
                setArticleSummary(res);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [clusterId]);

    return articleSummary;
}