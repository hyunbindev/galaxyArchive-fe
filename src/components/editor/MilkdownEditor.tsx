"use client";

import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Crepe, CrepeFeature} from "@milkdown/crepe";
import { listenerCtx } from '@milkdown/plugin-listener';
import { editorViewCtx } from '@milkdown/kit/core';
import "@milkdown/crepe/theme/frame-dark.css";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { Node } from '@milkdown/kit/prose/model';
interface Props{
    onChange?: (markdown: string)=>void;
    onImageUpload: (file:File)=>Promise<string>;
}
export interface MilkdownEditorRef {
    getImage: () => Node | undefined;
    changeImageUrl: (ori: string, url:string) => void;
}

const MilkdownEditor = forwardRef<MilkdownEditorRef, Props>((props,ref)=> {
    const editorRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null)

    const [debug, setDebug] = useState<Node | null>(null)
    useEffect(()=>console.log(debug?.descendants((node,pos,parent)=>{console.log(node)})),[debug])

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
                        return props.onImageUpload(file);
                    }
                }
            },
        });




        const { editor } = crepe;

        crepe.on((listener)=>{
            listener.markdownUpdated(()=>{
                editor.action((ctx)=>{
                    const { doc } = ctx.get(editorViewCtx).state
                    setDebug(doc)
                });

            })
        })

        editor.config((ctx) => {
            ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                props.onChange?.(markdown);
            });
        });



        // 에디터 생성
        crepe.create().then(() => {
            crepeRef.current = crepe;

            useImperativeHandle(ref, () => ({
                getImage:()=>{
                    editor.action((ctx)=>{
                        const { doc } = ctx.get(editorViewCtx).state
                        const imageNodes:Node[] = [];
                        doc.descendants((node,number)=>{
                            node
                        });
                        return imageNodes
                    });
                },
                changeImageUrl:(ori:string,url:string)=>{}
            }));
        });


        // 컴포넌트 파괴 시 에디터 자원 해제
        return () => {
            if (crepeRef.current) {
                crepeRef.current.destroy().then(r => crepeRef.current = null);
            }
        };
    }, []);

    return <div><div ref={editorRef}/></div>
});
export default MilkdownEditor;