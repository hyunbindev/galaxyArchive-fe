import {cache} from "react";
import {cookies} from "next/headers"
import lightApi from "@/lib/ApiClient";

export interface UserInfo{
    id:string;
    nickName:string;
    providerId:string;
    email:string;
    profileImageUrl:string;
    oauth2Provider:string;
}


export const getAuthenticatedUser = cache(async ():Promise<UserInfo | null> =>{
    const cookieStore = await cookies();
    const session = cookieStore.get('JSESSIONID')?.value;

    if(!session) return null;

    return lightApi.get<UserInfo>('/api/v1/users/me')
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL)
        .isCredentialRequest(true)
        .cookies({JSESSIONID: session})
        .catch((e)=>{ return null })
})

export default getAuthenticatedUser