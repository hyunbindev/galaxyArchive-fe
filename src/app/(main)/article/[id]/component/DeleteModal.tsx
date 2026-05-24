"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Field, FieldGroup} from "@/components/ui/field";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Trash2} from "lucide-react";
import useArticleDelete, {DeleteModalStatus} from "@/app/(main)/article/[id]/useDeleteArticle";
import {Article} from "@/app/(main)/article/[id]/getArticle";
import {ChangeEvent} from "react";

interface DeleteModalProps{
    article:Article;
}

export default function DeleteModal({article}:DeleteModalProps){

    const { requestDeleteArticle, titleInput, setTitleInput, status, message } = useArticleDelete(article);

    const onChangeTitleHandler = (e:ChangeEvent<HTMLInputElement>)=>{
        setTitleInput(e.target.value)
    }

    const isError = status !== DeleteModalStatus.WAIT;
    const labelClassName = isError ? "text-red-500 font-medium" : "text-zinc-600";

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    <Trash2 className="h-4 w-4" />Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>DeleteArticle</DialogTitle>
                    <DialogDescription>
                        Please enter the article title to confirm deletion.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Label htmlFor="name-1" className={labelClassName}>{message}</Label>
                        <Input id="name-1" name="name" value={titleInput} onChange={(e)=>{onChangeTitleHandler(e)}} placeholder={`${article.title}`} />
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="cursor-pointer" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="cursor-pointer" onClick={requestDeleteArticle}>Delete</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}