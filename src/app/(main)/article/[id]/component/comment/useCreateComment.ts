
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
            toast.warning("Please enter a comment.", { position: "bottom-center" })
            return false;
        }
        return true;
    }

    const afterCreateComment = ()=>{
        setText('');
        toast.info("Comment posted successfully.",{ position: "bottom-center" })
        router.refresh()
    }

    const requestArticleComment = ()=>{
        if(!validationText()) return;
        const res = lightApi.post(`/api/v1/articles/${articleId}/comments`)
            .body({text : text})
            .then((e)=>afterCreateComment())
            .catch((e)=>console.error(e))
    }

    const requestArticleRecomment = (parentId:number) =>{
        if(!validationText()) return;
        const res = lightApi.post(`/api/v1/articles/${articleId}/comments`)
            .body({text : text})
            .params({parentId : parentId})
            .then((e)=>afterCreateComment())
            .catch((e)=>console.error(e))
    }


    return { text , setText , requestArticleComment , requestArticleRecomment }
}