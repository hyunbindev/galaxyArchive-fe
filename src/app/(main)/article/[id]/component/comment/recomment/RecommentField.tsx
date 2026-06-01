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
        <div className="ml-10 pb-10">

            <FieldGroup className="max-w-full">
                <Field>
                    <InputGroup>
                        <InputGroupTextarea
                            value={text}
                            onChange={(e)=>setText(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton variant="default" size="sm" className="ml-auto" onClick={()=>requestArticleRecomment(commentId)}>
                                <SendHorizontal size={16} />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
            </FieldGroup>
        </div>
        </>
    )
}