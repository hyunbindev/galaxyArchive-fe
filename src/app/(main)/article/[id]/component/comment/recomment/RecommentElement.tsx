import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";
import {dateConvert} from "@/lib/utils";
import CommentOption from "@/app/(main)/article/[id]/component/comment/recomment/CommentOption";
import useDeleteComment from "@/app/(main)/article/[id]/component/comment/useDeleteComment";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import Link from "next/link";

interface RecommentElementProps{
    recomment:ArticleCommentResponse;
    userInfo:UserInfo|null;
    articleId:number;
}


export default function RecommentElement({recomment,articleId,userInfo}:RecommentElementProps){
    const {requestDelete} = useDeleteComment(articleId, recomment.id)
    return(
    <>
        <div className="relative not-last:before:absolute not-last:before:left-4.75 not-last:before:top-5 not-last:before:h-full not-last:before:w-px not-last:before:bg-zinc-200 dark:not-last:before:bg-zinc-800">
            <span className="absolute -top-2 ml-12 text-xs text-gray-500">{dateConvert(recomment.createdAt)}</span>
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border/40">
                    <AvatarImage
                        src={recomment.author.userProfileImageUrl}
                        alt={`${recomment.author.nickName}'s profile image`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                {userInfo &&
                    <CommentOption onDelete={requestDelete} authorInfo={recomment.author} userInfo={userInfo}/>}


                    <Link href={`/user/${recomment.author.userId}`}>
                        <span className="text-sm">{recomment.isDeleted? '삭제된 덧글 작성자':recomment.author.nickName}</span>
                    </Link>
            </div>
            <div className="ml-12 text-sm text-gray-700 dark:text-gray-400">
                {recomment.text}
            </div>
        </div>
    </>
    )
}