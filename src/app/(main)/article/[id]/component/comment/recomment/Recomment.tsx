import RecommentElement from "@/app/(main)/article/[id]/component/comment/recomment/RecommentElement";
import RecommentField from "@/app/(main)/article/[id]/component/comment/recomment/RecommentField";
import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";
import { UserInfo } from "@/lib/getAuthenticatedUser";

interface RecommentProps{
    articleId:number;
    commentId:number;
    recomments:ArticleCommentResponse[];
    authorInfo:UserInfo|null;
}


export function Recomment({ recomments, commentId, articleId, authorInfo }:RecommentProps) {
    return (
        <div className="relative ml-10 py-10 pl-5
            before:absolute before:-left-5.25 before:top-0 before:h-15 before:w-10
            before:border-l before:border-b before:border-zinc-200 dark:before:border-zinc-800
            before:rounded-bl-4xl"
        >
            <div className={recomments.length >0 ?`relative before:absolute before:left-4.75 before:top-5 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800` : ``}>
                <RecommentField articleId={articleId} commentId={commentId} authorInfo={authorInfo}/>
            </div>

            <div className="flex flex-col [&>div:not(:last-child)]:pb-10">
                {recomments.map((recomment,index)=>(<RecommentElement key={recomment.id} recomment={recomment}/>))}
            </div>

        </div>
    )
}