"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {User, User2} from "lucide-react";


interface AuthorInfoProps{
    userInfo : UserInfo|null;
}

export default function AuthorInfo({userInfo}:AuthorInfoProps){
    return(
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/40">

                <AvatarImage
                    src={userInfo?.profileImageUrl}
                    alt={`${userInfo?.nickName}'s profile image`}
                />

                <AvatarFallback>
                    ?
                </AvatarFallback>

            </Avatar>
            <span className="">{userInfo?.nickName}</span>
        </div>
    )
}