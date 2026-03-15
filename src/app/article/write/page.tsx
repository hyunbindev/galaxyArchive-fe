"use client";

import MilkdownEditor from "@/components/editor/MilkdownEditor";
export default function WritePage(){
    const date = new Date();

    return(<main className="relative max-w-6xl mx-auto">
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
                <MilkdownEditor/>
            </div>
        </div>
    </main>)
}