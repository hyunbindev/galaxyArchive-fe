"use client"

import dynamic from "next/dynamic";
import useGetArticleGraph from "@/app/(main)/test/useGetArticleGraph";

const ArticleGraphView = dynamic(
    () => import("@/components/view/articlegraphview/ArticleGraphView"),
    {
        ssr: false,
        loading: () => <div className="w-screen h-screen bg-transparent" />
    }
);

export default function MainArticleGraphView() {
    const { data, loading, error } = useGetArticleGraph();

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생...</div>;

    return (
        <div className="w-screen h-screen">
            <ArticleGraphView graph={data} />
        </div>
    );
}