import {cookies} from "next/dist/server/request/cookies";
import lightApi from "@/lib/ApiClient/index";

export async function getUser(){
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("JSESSIONID")?.value;

    if(!sessionId) return null;

    return lightApi.get<UserInfo>('/api/v1/users/me')
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL)
        .isCredentialRequest(true)
        .cookies({JSESSIONID: sessionId})
        .catch((e)=>{ return null })
}

export interface UserInfo{
    id:string;
    nickName:string;
    providerId:string;
    email:string;
    profileImageUrl:string;
    oauth2Provider:string;
}