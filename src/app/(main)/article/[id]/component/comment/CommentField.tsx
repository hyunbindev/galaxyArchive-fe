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
                            onChange={e=>{ setText(e.target.value)} }
                            placeholder="Write a comment..."
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton variant="default" size="sm" className="ml-auto cursor-pointer" onClick={requestArticleComment}>
                                <SendHorizontal/>
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
            </FieldGroup>
        </div>
    )
}