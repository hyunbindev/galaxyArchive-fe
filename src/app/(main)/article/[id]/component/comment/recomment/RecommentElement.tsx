import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import RecommentField from "@/app/(main)/article/[id]/component/comment/CommentField";
import RecommentAuthorInfo from "@/app/(main)/article/[id]/component/comment/recomment/RecommentAuthorInfo";
import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";
import {timeConvert} from "@/lib/utils";
import CommentOption from "@/app/(main)/article/[id]/component/comment/recomment/CommentOption";
import useArticleDelete from "@/app/(main)/article/[id]/useDeleteArticle";
import useDeleteComment from "@/app/(main)/article/[id]/component/comment/useDeleteComment";

interface RecommentElementProps{
    recomment:ArticleCommentResponse;
    articleId:number;
}


export default function RecommentElement({recomment,articleId}:RecommentElementProps){
    const {requestDelete} = useDeleteComment(articleId, recomment.id)
    return(
    <>
        <div className="relative not-last:before:absolute not-last:before:left-4.75 not-last:before:top-5 not-last:before:h-full not-last:before:w-px not-last:before:bg-zinc-200 dark:not-last:before:bg-zinc-800">
            <span className="absolute -top-2 ml-12 text-xs text-gray-500">{timeConvert(recomment.createdAt)}</span>
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border/40">
                    <AvatarImage
                        src={recomment.author.profileImageUrl}
                        alt={`${recomment.author.nickName}'s profile image`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <CommentOption onDelete={requestDelete}/>

                <span className="text-sm">{recomment.author.nickName}</span>
            </div>
            <div className="ml-12 text-sm text-gray-700 dark:text-gray-400">
                {recomment.text}
            </div>
        </div>
    </>
    )
}