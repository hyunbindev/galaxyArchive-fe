"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import lightApi from "@/lib/ApiClient";

export interface ArticleSummary {
    id: number;
    title: string;
    createdAt: string;
    description: string;
    commentsCount: number;
    keywords: string[];
    thumbnailUrl:string | null;
}

export interface ArticleSummaryPage {
    articles: ArticleSummary[];
    size: number;
    hasNextPage: boolean;
    cursorArticleId: number | null;
}

export default function useGetNewArticleList(authorId: string, size: number) {
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const lastArticleId = useRef<number | null>(null);
    const isLoadingRef = useRef(false);
    const hasNextPageRef = useRef(true);

    const requestNextPage = useCallback(async () => {
        if (isLoadingRef.current || !hasNextPageRef.current) return;

        const queryParams: Record<string, string> = {
            size: String(size),
            summaryTextLength: "2000",
        };

        if (lastArticleId.current !== null) {
            queryParams.lastArticleId = String(lastArticleId.current);
        }

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const res = await lightApi.get<ArticleSummaryPage>(`/api/v1/users/${authorId}/articles/summary`)
                .params(queryParams);

            console.log(res)

            setArticles((prev) => [...prev, ...res.articles]);
            setHasNextPage(res.hasNextPage);
            hasNextPageRef.current = res.hasNextPage;
            lastArticleId.current = res.hasNextPage ? res.cursorArticleId : null;
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [authorId, size]);

    useEffect(() => {
        setArticles([]);
        setHasNextPage(true);
        hasNextPageRef.current = true;
        lastArticleId.current = null;
        isLoadingRef.current = false;
    }, [authorId, size]);

    useEffect(() => {
        requestNextPage().catch(console.error);
    }, [requestNextPage]);

    return {articles, hasNextPage, isLoading, requestNextPage};
}
