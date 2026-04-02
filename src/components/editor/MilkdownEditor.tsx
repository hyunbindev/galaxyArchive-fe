"use client";

import React, {useEffect, useRef, useState} from "react";
import {Crepe, CrepeFeature} from "@milkdown/crepe";
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import "@milkdown/crepe/theme/frame-dark.css";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

interface Props{
    onChange?: (markdown: string)=> void;
}
interface Image{
    url:string;
    image:File;
}

export default function MilkdownEditor(props: Props) {
    const editorRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);

    const [images, setImages] = useState<Image[]>([]);

    useEffect(()=>{
        console.log(images)
    },[images])

    useEffect(() => {
        // 서버 사이드 렌더링 방지 및 중복 생성 방지
        if (!editorRef.current || crepeRef.current) return;

        const crepe = new Crepe({
            root: editorRef.current,
            defaultValue: '',
            featureConfigs: {
                'placeholder': {
                    text: ' / 입력시 추가할 태그가 보여집니다.',
                },
                [CrepeFeature.ImageBlock]: {
                    onUpload: async (file:File):Promise<string>=>{

                        const tempImage:Image = { url:URL.createObjectURL(file), image:file }

                        setImages(prev=>[...prev, tempImage])

                        return tempImage.url;
                    }
                }
            },
        });

        const { editor } = crepe;

        editor.config((ctx) => {
            ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
            props.onChange?.(markdown);
            });
        });

        // 에디터 생성
        crepe.create().then(() => {
            crepeRef.current = crepe;
        });

        // 컴포넌트 파괴 시 에디터 자원 해제
        return () => {
            if (crepeRef.current) {
                crepeRef.current.destroy().then(r => crepeRef.current = null);
            }
        };
    }, []);

    return <div><div ref={editorRef}/></div>
}