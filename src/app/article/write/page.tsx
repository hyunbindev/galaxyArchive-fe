"use client";

import React, { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";

// 🛡️ [핵심] Crepe의 전용 스타일을 반드시 가져와야 메뉴와 레이아웃이 깨지지 않습니다.
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
            defaultValue: "# Crepe 에디터 가동\n\n슬래시(`/`)를 입력하여 메뉴를 호출하거나, 문단 왼쪽의 `+` 버튼을 눌러보십시오.",
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

    return (
        <div className="w-full">
            {/* 🛡️ prose를 유지하고 싶다면 max-w-none을 붙이고,
            패딩을 완전히 없애고 싶다면 prose 클래스 자체를 제거하십시오. */}
            <div className="max-w-none">
                <div ref={editorRef} className="remove-crepe-padding" />
            </div>
        </div>
    );
}