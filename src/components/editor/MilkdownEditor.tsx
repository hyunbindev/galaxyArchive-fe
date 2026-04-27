"use client";

import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Crepe, CrepeFeature} from "@milkdown/crepe";
import { listenerCtx } from '@milkdown/plugin-listener';
import {editorViewCtx, editorViewOptionsCtx, serializerCtx} from '@milkdown/kit/core';
import { nodesCtx } from '@milkdown/core';
import "@milkdown/crepe/theme/frame-dark.css";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";


interface Props{
    onChange?: (markdown: string)=>void;
}
export interface MilkdownEditorRef {
    getImages: () => Map<number,string>|undefined;
    getMarkdown: ()=>string;
    changeImageUrl: (pos:number,url:string) => void;
    setReadOnly: (readOnly:boolean)=>void;
    getRawText: ()=>string;
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
            changeImageUrl:(pos:number,url:string)=>{
                if (!crepeRef.current) return;
                const { editor } = crepeRef.current;

                editor.action((ctx)=>{
                    const view = ctx.get(editorViewCtx);
                    const {tr} = view.state;
                    console.log(url)
                    const transaction = tr.setNodeMarkup(pos, undefined, {
                        src: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL?process.env.NEXT_PUBLIC_IMAGE_BASE_URL:"/image/"}/${url}`,
                    })
                    view.dispatch(transaction)
                })
            },
            getMarkdown:():string=>{
                if (!crepeRef.current) return "";
                return crepeRef.current.getMarkdown()
            },
            setReadOnly:(readOnly:boolean)=>{
                if(!crepeRef.current) return;
                const { editor } =crepeRef.current;
                editor.action((ctx) => {
                    const view = ctx.get(editorViewCtx);
                    view.setProps({
                        editable: () => !readOnly
                    });
                });
            },
            getRawText:()=>{
                if(!crepeRef.current) return "";
                const { editor } = crepeRef.current;

                return editor.action((ctx) => {
                    const view = ctx.get(editorViewCtx);
                    return view.state.doc.textContent;
                })
            }
        }));

    useEffect(() => {
        // 서버 사이드 렌더링 방지 및 중복 생성 방지
        const crepe = new Crepe({
            root: editorRef.current,
            defaultValue: '',
            featureConfigs: {
                'placeholder': {
                    text: ' / 입력시 추가할 태그가 보여집니다.',
                },
            },
        });

        if (!editorRef.current && crepeRef.current) return;
        crepeRef.current=crepe

        const { editor } = crepe;


        editor.config((ctx) => {
            ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                props.onChange?.(markdown);
            });
            ctx.update(editorViewOptionsCtx, (prev) => ({
                ...prev,
                scrollThreshold: 100,
                scrollMargin: 120,
            }));
        });



        // 에디터 생성
        crepe.create().then(() => {
            crepeRef.current = crepe;
        });


        return () => {
            const currentCrepe = crepeRef.current;
            crepeRef.current = null;
            currentCrepe?.destroy();
        };
    }, []);

    return <div><div ref={editorRef}/></div>
});
MilkdownEditor.displayName = 'MilkdownEditor';
export default MilkdownEditor;
