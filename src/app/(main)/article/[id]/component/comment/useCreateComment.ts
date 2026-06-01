
import lightApi from "@/lib/ApiClient";
import { useState } from "react";
import {useRouter} from "next/navigation";
import {Toast} from "radix-ui";
import {toast} from "sonner";


export default function useCreateComment(articleId:number){
    const router = useRouter()
    const [text,setText] = useState<string>('');

    const validationText=():boolean=>{
        if(text.trim().length == 0){
            toast.warning("덧글을 입력해 주세요.", { position: "bottom-center" })
            return false;
        }
        return true;
    }

    const requestArticleComment = ()=>{
        if(!validationText()) return;
        const res = lightApi.post(`/api/v1/articles/${articleId}/comments`)
            .body({text : text})
            .then((e)=>router.refresh())
            .catch((e)=>console.error(e))
    }

    const requestArticleRecomment = (parentId:number) =>{
        if(!validationText()) return;
        const res = lightApi.post(`/api/v1/articles/${articleId}/comments`)
            .body({text : text})
            .params({parentId : parentId})
            .then((e)=>router.refresh())
            .catch((e)=>console.error(e))
    }


    return { text , setText , requestArticleComment , requestArticleRecomment }
}