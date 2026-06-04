"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import { cn } from "@/lib/utils";
import {User, User2} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/dist/client/components/navigation";
import LoginLink from "@/components/LoginLink";


interface AuthorInfoProps{
    userInfo : UserInfo|null;
}

export default function AuthorInfo({userInfo}:AuthorInfoProps){
    const path = usePathname()
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
            {userInfo?
                <span className={cn("text-sm")}>{userInfo.nickName}</span>
                : <LoginLink className="text-sm text-muted-foreground hover:underline">덧글을 작성하려면 로그인이 필요합니다.</LoginLink>
            }
        </div>
    )
}