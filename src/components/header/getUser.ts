import {cookies} from "next/dist/server/request/cookies";
import api from "@/lib/api";

export async function getUser(){
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("JSESSIONID")?.value;

    if(!sessionId) return null;

    try{
        const response = await api.get("/api/v1/users/me",{
            headers:{
                Cookie: `JSESSIONID=${sessionId}`,
            },
        });
        console.log(response);
        return response.data;
    }catch(err){
        console.error(err);
        return null;
    }
}