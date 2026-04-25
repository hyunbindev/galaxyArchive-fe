import apiClient from "@/lib/ApiClient";

export default async function getArticle(articleId:number):Promise<Article>{
    return apiClient.get<Article>(`/api/v1/articles/${articleId}`)
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL)
}

export interface Article{
    id:number
    title:string
    author:Author
    text:string
    createdAt:string
}
export interface Author{
    id:string
    nickName:string
    profileImageUrl?:string
    oauth2Provider:string
}