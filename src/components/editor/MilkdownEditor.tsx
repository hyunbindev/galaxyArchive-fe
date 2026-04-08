"use client";

import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Crepe, CrepeFeature} from "@milkdown/crepe";
import { listenerCtx } from '@milkdown/plugin-listener';
import { editorViewCtx } from '@milkdown/kit/core';
import { nodesCtx } from '@milkdown/core';
import "@milkdown/crepe/theme/frame-dark.css";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";


interface Props{
    onChange?: (markdown: string)=>void;
}
export interface MilkdownEditorRef {
    getImages: () => Map<number,string>|undefined;
    changeImageUrl: (ori: string, url:string) => void;
}

const MilkdownEditor = forwardRef<MilkdownEditorRef, Props>((props,ref)=> {
    const editorRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null)

        useImperativeHandle(ref, () => ({
            getImages:(): Map<number,string>|undefined =>{

                if(!crepeRef.current) return;
                const { editor } = crepeRef.current

                return editor.action((ctx)=>{
                    const { doc } = ctx.get(editorViewCtx).state

                    const imageMap = new Map<number,string>();

                    doc.descendants((node, pos) => {

                        if (node.type.name == 'image-block') imageMap.set(pos, node.attrs.src);
                        console.log(node);
                    })

                    return imageMap;
                });
            },
            changeImageUrl:(ori:string,url:string)=>{}
        }));

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
});
MilkdownEditor.displayName = 'MilkdownEditor';
export default MilkdownEditor;