import {cookies} from "next/dist/server/request/cookies";

export async  function getUser(){
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("JSESSIONID")?.value;

    if(!sessionId == null) return null;

    try{
        const user = api.get();
    }catch(err){

    }
}