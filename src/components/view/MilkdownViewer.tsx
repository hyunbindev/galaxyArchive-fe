"use client"

import { Crepe } from "@milkdown/crepe";
import React, { useEffect, useRef } from "react";

interface Props {
    text: string;
}

export default function MilkdownViewer({ text }: Props) {
    const viewRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);
    const initializing = useRef(false);

    useEffect(() => {
        if (!viewRef.current || crepeRef.current || initializing.current) return;

        initializing.current = true;

        const crepe = new Crepe({
            root: viewRef.current,
            defaultValue: text,
        });

        crepe.setReadonly(true);

        crepe.create().then(() => {
            crepeRef.current = crepe;
            initializing.current = false; // 초기화 완료
        }).catch((err) => {
            console.error("Milkdown create failed:", err);
            initializing.current = false;
        });

        return () => {
            if (crepeRef.current) {
                const instance = crepeRef.current;

                instance.destroy().then(()=>{
                    crepeRef.current = null;
                    initializing.current = false;
                });

            }
        };
    }, [text]);

    return (
        <div className="milkdown-viewer-wrapper">
            <div ref={viewRef} />
        </div>
    );
}