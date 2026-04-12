"use client"
import {RefObject, useEffect, useState} from "react";
import api from "@/lib/api";
import {MilkdownEditorRef} from "@/components/editor/MilkdownEditor";


export interface UploadStatus {
    uploadPhase:UploadPhase;
    imageStatus: Map<number,number>|null;
    errorMsg:string|null;
    articleId:string|null;
}
export enum UploadPhase{
    IDLE = 'IDLE',
    IMAGE_UPLOAD = 'IMAGEUPLOAD',
    TEXT_UPLOAD = 'TEXTUPLOAD',
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
}
export default function useCreateArticle(ref:RefObject<MilkdownEditorRef|null>){
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');

    const [upLoadState, setUpLoadState] = useState<UploadStatus>({
        uploadPhase: UploadPhase.IDLE,
        imageStatus:null,
        errorMsg:null,
        articleId:null
    });


    const getImageMapFromEditor=():Map<number,string>|undefined=>{
        if(!ref.current) return
        return ref.current.getImages();
    }

    const ensureValidMimeType = (type: string) => {
        if (type.length === 0) throw Error("잘못된 이미지입니다.");
    };

    const uploadImage = async (pos:number,blobUrl:string)=>{
        try{
            ref.current?.setReadOnly(true)
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
            return response.data;
        }catch (e){
            ref.current?.setReadOnly(false)
            setUpLoadState(prev => ({
                ...prev,
                uploadPhase: UploadPhase.FAIL,
                imageStatus:null,
                errorMsg:null,
                articleId:null
            }));
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
                    if(!ref.current) return;
                    ref.current.changeImageUrl(pos,uploadedUrl);
                }
            }

            setUpLoadState(prev => ({ ...prev, uploadPhase: UploadPhase.TEXT_UPLOAD }));

            if(!ref.current) return;


            const response =await api.post("/api/v1/articles",{
                title:title,
                text:ref.current.getText(),
            })

            setUpLoadState(prev => ({ ...prev, uploadPhase: UploadPhase.SUCCESS,articleId:response.data }));

        }catch (err){
            console.error(err)
            setUpLoadState(prev => ({ ...prev, uploadPhase: UploadPhase.FAIL, }));
            throw err
        }
    }

    return {title, setTitle, text, setText ,publishArticle, upLoadState }
}