"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {LogOutIcon, MoreVertical, SettingsIcon, UserIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import useUserAuth from "@/components/header/useUserAuth";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import Link from "next/link";

interface UserDropDownMenuProps{
    userInfo:UserInfo;
}

export default function UserDropDownMenu({userInfo}:UserDropDownMenuProps){
    const { logout } = useUserAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link href={`/user/${userInfo.id}`}>
                    <DropdownMenuItem>
                        <UserIcon />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>logout()} variant="destructive">
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}