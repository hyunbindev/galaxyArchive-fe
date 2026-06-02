import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserInfo} from "@/lib/getAuthenticatedUser";

interface RecommentAuthorInfo{
    authorInfo:UserInfo|null;
}

export default function RecommentAuthorInfo({authorInfo}:RecommentAuthorInfo){
    return(
        <div className="flex items-center gap-3 pb-3">
            <Avatar className="h-9 w-9 border border-border/40">
                <AvatarImage
                    src={authorInfo?.profileImageUrl}
                    alt={`${authorInfo?.nickName}'s profile image`}
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="">{authorInfo?.nickName}</span>
        </div>
    )
}