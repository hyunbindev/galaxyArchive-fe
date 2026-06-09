import lightApi from "@/lib/ApiClient";


export default function useGetUserProfile(userId:string){

    const getUserProfile = async() =>{
        const userProfileRes = await lightApi.get(`/api/v1/users/${userId}`);
        console.log(userProfileRes);
    }

    return { getUserProfile }
}