import { ThemeModeToggle } from "@/components/theme/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import UserDropDownMenu from "@/components/header/UserDropDownMenu";
import { BlackButton } from "../ui/black-button";
import getAuthenticatedUser from "@/lib/getAuthenticatedUser";

export async function Header() {
    const userInfo = await getAuthenticatedUser();
    return (
        <header className="fixed top-0 h-15 w-full flex justify-center items-center p-2 bg-white dark:bg-background backdrop-blur-md z-50 border-b border-border/50">
            <div className="w-full px-10 min-w-6xl mx-auto flex justify-between items-center">
                <Link href="/">
                    <h1 className="font-bold text-lg text-foreground">galaxyArchive</h1>
                </Link>
                <nav className="flex flex-1 justify-start gap-5 px-20
                                [&>a]:cursor-pointer
                                [&>a]:text-sm">
                    <Link href="/article/write">Publish Article</Link>
                </nav>
                    <div className="flex items-center gap-2">
                        <ThemeModeToggle />
                        {userInfo? (
                            <>
                            <UserDropDownMenu/>
                            <Avatar className="h-8 w-8 border border-border/40">
                                <AvatarImage
                                    src={userInfo.profileImageUrl}
                                    alt="@profile image"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="text-md font-medium text-foreground">{userInfo.nickName}</div>
                            </>
                        ):(
                        <a href="/login">
                            <BlackButton className="cursor-pointer">Sign In</BlackButton>
                        </a>
                        )}
                    </div>
            </div>
        </header>
    );
}