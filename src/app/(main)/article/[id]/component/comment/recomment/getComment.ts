import lightApi from "@/lib/ApiClient";
import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";

export async function getComments(articleId: number){
    return await lightApi.get<ArticleCommentResponse[]>(`/api/v1/articles/${articleId}/comments`)
        .baseUrl(process.env.INTERNAL_API_URL ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL)
        .catch((e) => {
            console.log(e);
            return [];
        });
}