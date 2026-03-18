"use client";

import MilkdownEditor from "@/components/editor/MilkdownEditor";
import { Button } from "@/components/ui/button"
import {useEffect, useState} from "react";

export default function WritePage(){
    const date = new Date();
    const [text,setText] = useState<String>('');
    const [characterCount,setCharacterCount] = useState<number>(0);

    useEffect(()=>{
        setCharacterCount(text.length);
    },[text])

    return(<main className="relative max-w-6xl mx-auto bg-background min-h-full pb-20">

        <div className="flex-col">
            <div className="w-full flex flex-col pt-10">
                <span className="text-gray-500">{date.getFullYear()}.{date.getMonth()+1}.{date.getDate()}</span>
                <input
                    id="title"
                    className="text-4xl border-none outline-none focus:ring-0 bg-transparent border-3"
                    placeholder="제목을 입력해 주세요."
                />
            </div>
            <div className="flex-1">
                <MilkdownEditor onChange={setText}/>
            </div>
        </div>
        <footer className="fixed bottom-0 left-0 w-full border-t border-border/50 bg-background">
            <div className="max-w-6xl mx-auto flex justify-between items-center py-5 w-full">
                <div>{characterCount} characters</div>
                <div>
                    <Button variant="outline" size="sm">
                        Create Article
                    </Button>
                </div>
            </div>
        </footer>
    </main>)
}