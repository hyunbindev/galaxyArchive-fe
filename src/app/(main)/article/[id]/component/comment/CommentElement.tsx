"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Recomment} from "@/app/(main)/article/[id]/component/comment/recomment/Recomment";

import {ArticleCommentResponse} from "@/app/(main)/article/[id]/component/type";

import {useEffect, useState} from "react";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {cn, dateConvert} from "@/lib/utils";
import {Toggle} from "@/components/ui/toggle";
import {MessageSquare} from "lucide-react";
import CommentOption from "@/app/(main)/article/[id]/component/comment/recomment/CommentOption";
import useDeleteComment from "@/app/(main)/article/[id]/component/comment/useDeleteComment";
import Link from "next/link";


interface CommentElementProps{
    articleId:number;
    comment:ArticleCommentResponse;
    index:number;
    totalSize:number;
    userInfo:UserInfo|null;
}

export default function CommentElement({ comment , index , totalSize , articleId , userInfo }:CommentElementProps){
    const [viewReply , setViewReply] = useState<boolean>(false);

    useEffect(()=>{
        if(comment.isDeleted && comment.children.length == 0) setViewReply(false);
    },[comment.children , comment.isDeleted])

    const { requestDelete } = useDeleteComment(articleId, comment.id)
    return(
        <div className={`relative flex flex-col pb-7 ${(index < totalSize-1)||viewReply ? 'not-last:before:absolute before:left-4.75 not-last:before:top-5 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800':''}`}>
            <span className="absolute -top-2 ml-12 text-xs text-gray-500">{dateConvert(comment.createdAt)}</span>

            <div className="flex items-center gap-3">

                <Avatar className="h-9 w-9 border border-border/40 z-1">
                    <AvatarImage
                        src={comment.author.userProfileImageUrl}
                        alt={`${comment.author.nickName}'s profile image`}
                    />
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>

                {!comment.isDeleted && userInfo && <CommentOption onDelete={requestDelete} authorInfo={comment.author} userInfo={userInfo}/>}

                {comment.isDeleted?
                    <span className="text-sm">{comment.isDeleted? '삭제된 덧글 작성자':comment.author.nickName}</span>:
                    <Link href={`/user/${comment.author.userId}`}>
                        <span className="text-sm">{comment.isDeleted? '삭제된 덧글 작성자':comment.author.nickName}</span>
                    </Link>
                }
            </div>

            <div className={cn("relative ml-12 text-gray-700 dark:text-gray-400", viewReply && "before:absolute before:content-[''] before:-left-7.25 before:top-0 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800")}>
                <div className="pb-3 whitespace-pre-wrap text-sm">{comment.isDeleted? "사용자가 삭제한 덧글 입니다.":comment.text}</div>
                {!(comment.children.length <1 && comment.isDeleted) &&
                    <Toggle pressed={viewReply} onClick={()=>setViewReply(!viewReply)} className="cursor-pointer">
                        <MessageSquare />
                        <span className="text-xs">{comment.children.length.toLocaleString()}</span>
                    </Toggle>
                }
            </div>
            {viewReply && <Recomment recomments={comment.children} commentId={comment.id} articleId={articleId} userInfo={userInfo} isParentDeleted={comment.isDeleted}/>}
        </div>
    )
}