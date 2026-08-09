
import apiClient from "@/lib/ApiClient";
import {cookies} from "next/headers";

export default async function getArticle(articleId:number):Promise<Article>{
    const cookieStore = await cookies();
    const visitorCookie = cookieStore.get("GAL_VISITOR")?.value;
    const session = cookieStore.get("GAL_AUT")?.value;
    const cookieMap: Record<string, string> = {};

    if (visitorCookie) {
        cookieMap.GAL_VISITOR = visitorCookie;
    }
    if (session) {
        cookieMap.GAL_AUT = session;
    }

    return apiClient.get<Article>(`/api/v1/articles/${articleId}`)
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL)
        .cookies(cookieMap)
        .isCredentialRequest(true)

}

export interface Article{
    id:number
    title:string
    author:Author
    text:string
    keywords:string[]
    createdAt:string
}

export interface Author{
    id:string;
    nickName:string;
    bio:string;
    profileImageUrl?:string;
    oauth2Provider:string;
}