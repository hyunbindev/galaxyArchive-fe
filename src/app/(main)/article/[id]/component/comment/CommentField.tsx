"use client"

import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { SendHorizontal } from "lucide-react"
import useCreateComment from "@/app/(main)/article/[id]/component/comment/useCreateComment";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {useRouter} from "next/navigation";


interface CommentFieldProps {
    articleId:number;
    userInfo:UserInfo;
}

export default function CommentField({articleId, userInfo}:CommentFieldProps){
    const router = useRouter();

    const { text , setText , requestArticleComment } = useCreateComment(articleId);

    const placeHolder:string = userInfo? "write a comment..." : "Log in to leave a comment"


    return(
        <div className="relative ml-10 pb-10">
            <FieldGroup className="max-w-full">
                <Field>
                    <InputGroup>
                        <InputGroupTextarea
                            value={text}
                            disabled={!userInfo}
                            rows={1}
                            className={cn("text-sm py-2")}
                            onChange={e=>{ setText(e.target.value)} }
                            placeholder={placeHolder}
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