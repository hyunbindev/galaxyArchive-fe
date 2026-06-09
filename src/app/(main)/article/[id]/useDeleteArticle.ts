"use client"
import {Article} from "@/app/(main)/article/[id]/getArticle";
import {useState} from "react";
import lightApi from "@/lib/ApiClient";
import {useRouter} from "next/navigation";
import {toast} from "sonner";


export enum DeleteModalStatus {
    WAIT = "WAIT",
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    INVALID_TITLE = "INVALID_TITLE"
}

export default function useArticleDelete(article:Article){
    const router = useRouter()

    const [titleInput , setTitleInput]  = useState<string>('');

    const [status, setStatus] = useState<DeleteModalStatus>(DeleteModalStatus.WAIT);

    const [message, setMessage] = useState<string>('제목을 입력해 주세요.');

    const requestDeleteArticle = ()=>{

        if(titleInput !== article.title){
            setStatus(DeleteModalStatus.INVALID_TITLE);
            setMessage('게시글 제목이 일치하지 않습니다. 다시 확인해 주세요.')
            return;
        }

        const res = lightApi.delete(`/api/v1/articles/${article.id}`)
            .isCredentialRequest(true)
            .params({articleTitle : titleInput})
            .catch((e)=>console.error(e));

        toast.info("게시글이 삭제 되었습니다.",{position : "top-center"})


        router.back()
    }

    return { requestDeleteArticle, titleInput, setTitleInput, status, message }
}