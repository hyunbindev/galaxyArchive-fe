import lightApi from "@/lib/ApiClient";
import {useRouter} from "next/navigation";


export default function useDeleteComment(articleId:number,commentId:number){
    const router = useRouter()
    const requestDelete= () => {
        const res = lightApi.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
            .then(()=>router.refresh())
            .catch((e)=>console.error(e))
    }
    return { requestDelete }
}