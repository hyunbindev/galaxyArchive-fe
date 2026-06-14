import AuthorInfo from "@/app/(main)/article/[id]/component/comment/AuthorInfo";

import CommentElement from "@/app/(main)/article/[id]/component/comment/CommentElement";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import CommentField from "@/app/(main)/article/[id]/component/comment/CommentField";
import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";
import {cn} from "@/lib/utils";


interface ArticleCommentProps{
    userInfo:UserInfo|null;
    articleId:number;
    comments:ArticleCommentResponse[]
}

export default function ArticleComment({userInfo, articleId, comments}:ArticleCommentProps){

    return(
        <div className="flex flex-col py-5">
            <div className={cn(comments.length > 0 && "relative before:absolute before:left-4.75 before:top-5 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800")}>
                <AuthorInfo userInfo={userInfo}/>
                <CommentField articleId={articleId} userInfo={userInfo}/>
            </div>

            <div>
                {comments.map((comment, index)=>(
                    <CommentElement key={comment.id} comment={comment} articleId={articleId} index={index} totalSize={comments.length} userInfo={userInfo}/>
                ))}
            </div>
        </div>
    )
}