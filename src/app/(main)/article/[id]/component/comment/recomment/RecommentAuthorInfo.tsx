import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {cn} from "@/lib/utils";
import Link from "next/link";

interface RecommentAuthorInfo{
    authorInfo:UserInfo|null;
}

export default function RecommentAuthorInfo({authorInfo}:RecommentAuthorInfo){
    return(
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/40">
                <AvatarImage
                    src={authorInfo?.profileImageUrl}
                    alt={`${authorInfo?.nickName}'s profile image`}
                />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            {authorInfo?
                <span className={cn("text-sm")}>{authorInfo.nickName}</span>
                : <Link className="text-sm text-muted-foreground hover:underline" href="/login">답글을 작성하려면 로그인이 필요합니다.</Link>
            }
        </div>
    )
}