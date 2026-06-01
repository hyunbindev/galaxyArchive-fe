"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserInfo} from "@/lib/getAuthenticatedUser";


interface AuthorInfoProps{
    userInfo : UserInfo|null;
}

export default function AuthorInfo({userInfo}:AuthorInfoProps){
    return(
        <div className="flex items-center gap-3 pb-3">
            <Avatar className="h-10 w-10 border border-border/40">

                <AvatarImage
                    src={userInfo?.profileImageUrl}
                    alt={`${userInfo?.nickName}'s profile image`}
                />

                <AvatarFallback>CN</AvatarFallback>

            </Avatar>
            <span className="text-lg">{userInfo?.nickName}</span>
        </div>
    )
}