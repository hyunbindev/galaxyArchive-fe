import {cookies} from "next/dist/server/request/cookies";

export async function getUser(){
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("JSESSIONID")?.value;

    if(!sessionId) return null;

    try{

        const response = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/users/me`,{
            headers:{
                'Cookie': `JSESSIONID=${sessionId}`,
                'Content-Type': 'application/json'
            }
        })

        if(!response.ok){
            //TODO-예외처리
            console.error(response)
        }


        return response.json();
    }catch(err){
        //TODO-예외처리
        console.error(err)
        return null;
    }
}