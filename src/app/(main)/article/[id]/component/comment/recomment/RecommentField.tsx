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
import RecommentAuthorInfo from "@/app/(main)/article/[id]/component/comment/recomment/RecommentAuthorInfo";
import useCreateComment from "@/app/(main)/article/[id]/component/comment/useCreateComment";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface RecommentFieldProps {
    articleId:number;
    commentId:number;
    authorInfo:UserInfo|null;
}

export default function RecommentField({ articleId ,commentId ,authorInfo }:RecommentFieldProps){
    const { text, setText, requestArticleRecomment } = useCreateComment(articleId);
    return(
        <>
        <RecommentAuthorInfo authorInfo={authorInfo}/>
        <div className="ml-10 pb-7">

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
                        <Button variant="default" size="xs" className={cn("absolute right-2 bottom-1.5 cursor-pointer")} onClick={()=>requestArticleRecomment(commentId)}>
                            <SendHorizontal/>
                        </Button>
                    </InputGroup>
                </Field>
            </FieldGroup>
        </div>
        </>
    )
}