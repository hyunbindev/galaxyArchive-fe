"use client"

import { Crepe } from "@milkdown/crepe";
import React, {useEffect, useRef} from "react";


interface Props{
    text:string
}

export default function MilkdownViewer({text}:Props){
    const viewRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);


    useEffect(()=>{
        if(!viewRef.current || crepeRef.current) return;

        const crepe = new Crepe({
            root: viewRef.current,
            defaultValue:text,
        });

        crepe.setReadonly(true)

        crepe.create().then(()=>{crepeRef.current = crepe});

        return () => {
            crepeRef.current?.destroy().then(() => {
                crepeRef.current = null;
            });
        };
    },[text])

    return <div><div ref={viewRef}/></div>
}