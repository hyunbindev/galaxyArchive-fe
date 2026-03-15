"use client";

import React, { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/frame-dark.css";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

export default function MilkdownEditor() {
    const editorRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);

    useEffect(() => {
        // 서버 사이드 렌더링 방지 및 중복 생성 방지
        if (!editorRef.current || crepeRef.current) return;

        // Crepe 인스턴스 생성 (슬래시 메뉴, 블록 핸들 등이 기본 포함됨)
        const crepe = new Crepe({
            root: editorRef.current,
            defaultValue: '', // Placeholder를 보여주려면 비워둬야 합니다.
            featureConfigs: {
                'placeholder': {
                    text: '"/"입력시 추가할 태그가 보여집니다.',
                },
            },
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