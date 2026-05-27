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



export default function CommentField(){
    return(
        <>
        <RecommentAuthorInfo/>
        <div className="ml-10 pb-10">

            <FieldGroup className="max-w-full">
                <Field>
                    <InputGroup>
                        <InputGroupTextarea
                            placeholder="Write a comment..."
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton variant="default" size="sm" className="ml-auto">
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