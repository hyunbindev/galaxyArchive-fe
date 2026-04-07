"use client"
import {useEffect, useState} from "react";
import api from "@/lib/api";
import {useRouter} from "next/navigation";

interface Image{
    url:string;
    image:File;
}
export default function useCreateArticle(){
    const [title, setTitle] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [images,setImages] = useState<Image[]>([]);

    const router = useRouter()

    useEffect(()=>{console.log(images)},[images])


    const onImageUpload = async(file:File)=>{
        const image = {url:URL.createObjectURL(file), image:file}
        setImages(prev => [...prev, image]);
        return image.url;
    }

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

    return {title, setTitle, text, setText ,publishArticle, isUploading ,onImageUpload }
}