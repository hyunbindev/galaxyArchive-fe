import {useEffect, useRef, useState} from "react";
import lightApi from "@/lib/ApiClient";

export interface ArticleSummary{
    id:number;
    title:string;
    createdAt:string;
    description:string;
    commentsCount:number;
}

export interface ArticleSummaryPage{
    articles:ArticleSummary[];
    size:number;
    hasNextPage:boolean;
    cursorArticleId:number|null
}


export default function useGetNewArticleList(authorId:string, size:number){
    const [articleSummeryPage, setArticleSummeryPage] = useState<ArticleSummary[][]>([]);
    const lastArticleId = useRef<number | null>(null);
    const isLoading = useRef<boolean>(false);

    useEffect(()=>{
        const requestNewArticleFirstPage = async() =>{
            const queryParams:Record<string,any> = { size : size }
            if(lastArticleId){
                queryParams['lastArticleId'] = lastArticleId.current? lastArticleId.current:'';
            }
            isLoading.current = true;

            const res = await lightApi.get<ArticleSummaryPage>(`/api/v1/users/${authorId}/articles`)
                .baseUrl(process.env.INTERNAL_API_URL ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL)
                .params(queryParams)

            isLoading.current = false;

            setArticleSummeryPage(prev=>[...prev, res.articles]);
            if(res.hasNextPage){
                lastArticleId.current = res.cursorArticleId;
                requestNextPage();
            }
        }

        requestNewArticleFirstPage().catch(e => console.error(e))
    },[])

    const requestNextPage = async() =>{
        if(lastArticleId==null && isLoading.current) return;
        const queryParams:Record<string,any> = { size : size , lastArticleId : lastArticleId.current }
        isLoading.current = true;
        
        const res = await lightApi.get<ArticleSummaryPage>(`/api/v1/users/${authorId}/articles`)
            .baseUrl(process.env.INTERNAL_API_URL ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL)
            .params(queryParams)

        setArticleSummeryPage(prev=>[...prev, res.articles]);
        if(res.hasNextPage){
            lastArticleId.current = res.cursorArticleId;
        }else{
            lastArticleId.current = null;
        }
        isLoading.current=false;
    }

    return { articleSummeryPage, requestNextPage, lastArticleId }
}
