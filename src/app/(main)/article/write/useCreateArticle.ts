"use client"
import { useState } from "react";
import api from "@/lib/api";
import {useRouter} from "next/navigation";

export default function useCreateArticle(){
    const [title, setTitle] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const router = useRouter()

    const publishArticle = async()=>{
        try {
            const response =await api.post("/api/v1/articles",{
                title:title,
                text:text,
            })
            setIsUploading(true);
            router.replace(`/article/${response.data}`)
        }catch (err){
            console.error(err)
            setIsUploading(false);
        }
    }

    return {title, setTitle, text, setText ,publishArticle, isUploading }
}