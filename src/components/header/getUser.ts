import {cookies} from "next/dist/server/request/cookies";
import api from "@/lib/api";
import axios from "axios";

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
        return response.data;
    }catch(err){
        //AXIOS EXCEPTION HANDLER
        if(axios.isAxiosError(err)){
            const status = err.response?.status
            if(status == 401) cookieStore.delete("JSESSIONID");
        }
        return null;
    }
}