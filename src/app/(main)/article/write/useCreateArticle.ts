"use client"
import {useEffect, useState} from "react";
import api from "@/lib/api";

export default function useCreateArticle(){
    const [title, setTitle] = useState<string>('')
    const [text, setText] = useState<string>('')

    const publishArticle = async()=>{
        const res =await api.post("/api/v1/articles",{
            title:title,
            text:text,
        })
    }

    return {title, setTitle, text, setText ,publishArticle }
}