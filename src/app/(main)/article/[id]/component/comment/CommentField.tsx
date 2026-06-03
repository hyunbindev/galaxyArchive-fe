"use client"

import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { SendHorizontal } from "lucide-react"
import useCreateComment from "@/app/(main)/article/[id]/component/comment/useCreateComment";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface CommentFieldProps {
    articleId:number;
}

export default function CommentField({articleId}:CommentFieldProps){

    const { text , setText , requestArticleComment } = useCreateComment(articleId);

    return(
        <div className="ml-10 pb-10">
            <FieldGroup className="max-w-full">
                <Field>
                    <InputGroup>
                        <InputGroupTextarea
                            value={text}
                            rows={1}
                            className={cn("text-sm py-2")}
                            onChange={e=>{ setText(e.target.value)} }
                            placeholder="Write a comment..."
                        />
                        <Button variant="default" size="xs" className={cn("absolute right-2 bottom-1.5 cursor-pointer")} onClick={requestArticleComment}>
                            <SendHorizontal/>
                        </Button>
                    </InputGroup>
                </Field>
            </FieldGroup>
        </div>
    )
}