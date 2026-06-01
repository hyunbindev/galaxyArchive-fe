import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import RecommentField from "@/app/(main)/article/[id]/component/comment/CommentField";
import RecommentAuthorInfo from "@/app/(main)/article/[id]/component/comment/recomment/RecommentAuthorInfo";
import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";
import {timeConvert} from "@/lib/utils";

interface RecommentElementProps{
    recomment:ArticleCommentResponse;

}


export default function RecommentElement({recomment}:RecommentElementProps){
    return(
    <>
        <div className="relative not-last:before:absolute not-last:before:left-4.75 not-last:before:top-5 not-last:before:h-full not-last:before:w-px not-last:before:bg-zinc-200 dark:not-last:before:bg-zinc-800">
            <span className="absolute -top-2 left-1 ml-12 text-xs text-gray-500">{timeConvert(recomment.createdAt)}</span>
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/40">
                    <AvatarImage
                        src={recomment.author.profileImageUrl}
                        alt={`${recomment.author.nickName}'s profile image`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-lg">김현빈</span>
            </div>
            <div className="ml-14 text-gray-700 dark:text-gray-400">
                {recomment.text}
            </div>
        </div>
    </>
    )
}