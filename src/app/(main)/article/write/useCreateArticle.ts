"use client"
import {RefObject, useEffect, useState} from "react";
import api from "@/lib/api";
import {useRouter} from "next/navigation";
import {MilkdownEditorRef} from "@/components/editor/MilkdownEditor";
import {blob} from "node:stream/consumers";



export interface UploadStatus {
    uploadPhase:UploadPhase;
    imageStatus: Map<number,number>|null;
    errorMsg:string|null;
}
export enum UploadPhase{
    IDLE = 'IDLE',
    IMAGE_UPLOAD = 'IMAGEUPLOAD',
    TEXTUP_LOAD = 'TEXTUPLOAD',
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
}
export default function useCreateArticle(ref:RefObject<MilkdownEditorRef|null>){
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');

    const [upLoadState, setUpLoadState] = useState<UploadStatus>({
        uploadPhase: UploadPhase.IDLE,
        imageStatus:null,
        errorMsg:null
    });

    const router = useRouter()

    const getImageMapFromEditor=():Map<number,string>|undefined=>{
        if(!ref.current) return;
        return ref.current.getImages();
    }

    const ensureValidMimeType = (type: string) => {
        if (type.length === 0) throw Error("잘못된 이미지입니다.");
    };

    const uploadImage = async (pos:number,blobUrl:string)=>{
        try{
            const blobResponse = await fetch(blobUrl);
            const imageBlob = await blobResponse.blob();

            const mimeType:string = imageBlob.type

            if(mimeType.length==0) ensureValidMimeType("잘못된 이미지 입니다")

            const response = await api.post("/api/v1/articles/images", imageBlob,{
                headers: {
                    "Content-Type": "application/octet-stream",
                    "X-Content-Type": mimeType,
                    "X-Content-Length": imageBlob.size.toString(),
                },
                transformRequest: [(data) => data],
                responseType: 'blob',
                onUploadProgress:(progressEvent)=>{
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || imageBlob.size)
                    )
                    setUpLoadState(prev => {
                        const nextMap = new Map(prev.imageStatus);

                        nextMap.set(pos, percent);

                        return {
                            ...prev,
                            imageStatus: nextMap
                        };
                    });
                }
            })
            return response.data.url;
        }catch (e){
            throw e
        }
    }

    const publishArticle = async()=>{
        try {
            const articleImages = getImageMapFromEditor();

            if (articleImages) {
                const imageStatusMap = new Map();

                articleImages.forEach((_,pos)=>{imageStatusMap.set(pos,0)})

                setUpLoadState(prev => ({
                    ...prev,
                    uploadPhase: UploadPhase.IMAGE_UPLOAD,
                    imageStatus: new Map(imageStatusMap)
                }));

                for(const [pos,blobUrl] of articleImages){
                    const uploadedUrl = await uploadImage(pos,blobUrl);
                    //TODO- replace node attrs url
                    console.log(`${pos} : uploadedUrl`)
                }
            }

            setUpLoadState(prev => ({ ...prev, uploadPhase: UploadPhase.TEXTUP_LOAD }));


            const response =await api.post("/api/v1/articles",{
                title:title,
                text:text,
            })

            setUpLoadState(prev => ({ ...prev, uploadPhase: UploadPhase.SUCCESS }));

            //router.replace(`/article/${response.data}`)
        }catch (err){
            console.error(err)
            setUpLoadState(prev => ({ ...prev, uploadPhase: UploadPhase.FAIL, }));
            throw err
        }
    }

    return {title, setTitle, text, setText ,publishArticle, upLoadState }
}