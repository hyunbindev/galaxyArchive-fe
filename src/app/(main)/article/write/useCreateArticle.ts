"use client"
import {RefObject, useEffect, useState} from "react";
import api from "@/lib/api";
import {useRouter} from "next/navigation";
import {MilkdownEditorRef} from "@/components/editor/MilkdownEditor";
import {blob} from "node:stream/consumers";

interface Image{
    url:string;
    image:File;
}
export default function useCreateArticle(ref:RefObject<MilkdownEditorRef|null>){
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const router = useRouter()

    const getImageMapFromEditor=():Map<number,string>|undefined=>{
        if(!ref.current) return;
        return ref.current.getImages();
    }
    const ensureValidMimeType = (type: string) => {
        if (type.length === 0) throw Error("잘못된 이미지입니다.");
    };

    const uploadImage = async(blobUrl:string)=>{
        try{
            const blobResponse = await fetch(blobUrl);
            const imageBlob = await blobResponse.blob();

            const mimeType:string = imageBlob.type

            if(mimeType.length==0) ensureValidMimeType("잘못된 이미지 입니다")

            const response = await api.post("/api/v1/articles/images", imageBlob,{
                headers: {
                    "Content-Type": mimeType,
                    "Content-Length": imageBlob.size.toString(),
                }
            })

            return response.data.url;
        }catch (e){
            throw e
        }
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
            throw err
        }
    }

    return {title, setTitle, text, setText ,publishArticle, isUploading }
}