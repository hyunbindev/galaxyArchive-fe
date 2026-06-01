"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Recomment} from "@/app/(main)/article/[id]/component/comment/recomment/Recomment";

import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";

import {ArrowDown, CornerDownRight} from "lucide-react";
import {useState} from "react";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {timeConvert} from "@/lib/utils";

interface CommentElementProps{
    articleId:number;
    comment:ArticleCommentResponse;
    index:number;
    totalSize:number;
    authorInfo:UserInfo|null;
}

export default function CommentElement({ comment , index , totalSize , articleId, authorInfo }:CommentElementProps){
    const [viewReply , setViewReply] = useState<boolean>(false);
    return(
        <div className={`relative flex flex-col pb-10 ${(index < totalSize-1)||viewReply ? 'not-last:before:absolute before:left-4.75 not-last:before:top-5 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800':''}`}>
            <span className="absolute -top-2 ml-13 text-xs text-gray-500">{timeConvert(comment.createdAt)}</span>

            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/40 z-1">
                    <AvatarImage
                        src={comment.author.profileImageUrl}
                        alt={`${comment.author.nickName}'s profile image`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-lg">{comment.author.nickName}</span>
            </div>

            <div className={`relative ml-14 text-gray-700 dark:text-gray-400 ${viewReply && "before:absolute before:content-[''] before:-left-9.25 before:top-0 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800"}`}>
                <div className="pb-3">{comment.text}</div>
                <div onClick={()=>setViewReply(!viewReply)} className="flex gap-2 items-center cursor-pointer hover:underline text-gray-600">
                    <span>{comment.children.length} recomments</span>
                    <ArrowDown className="h-4 w-4" />
                </div>
            </div>
            {viewReply && <Recomment recomments={comment.children} commentId={comment.id} articleId={articleId} authorInfo={authorInfo}/>}
        </div>
    )
}