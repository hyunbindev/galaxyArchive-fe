"use client";

import MilkdownEditor from "@/components/editor/MilkdownEditor";
import { Button } from "@/components/ui/button"
import useCreateArticle from "@/app/(main)/article/write/useCreateArticle";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";

export default function WritePage(){
    const date = new Date();

    const {title, setTitle ,text, setText , publishArticle, isUploading} = useCreateArticle();

    return(
    <main className="max-w-4xl mx-auto bg-background min-h-full pb-20">
        <div className="flex-col">
            <div className="w-full flex flex-col pt-10">
                <span className="text-gray-500">{date.getFullYear()}.{date.getMonth()+1}.{date.getDate()}</span>
                <input
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
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
                <div>{text.length.toLocaleString()} characters</div>
                <div>
                    <Button onClick={publishArticle} disabled={text.length<1 || title.length<1} className="text-md cursor-pointer" variant="outline" size="lg">
                        Publish Article
                    </Button>
                </div>
            </div>
        </footer>
        {isUploading && <Dialog open={true}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>GalaxyArchive</DialogTitle>
                    <DialogDescription>
                        Uploading Article to GalaxyArchive..
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>}
    </main>
    )
}