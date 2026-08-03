import {ReactNode} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import lightApi from "@/lib/ApiClient";
import {getAuthenticatedUser} from "@/lib/getAuthenticatedUser";
import UserProfileNav from "@/app/(main)/user/[id]/UserProfileNav";
import {UserProfile} from "@/app/(main)/user/[id]/type";

interface LayoutProps {
    children: ReactNode;
    params: Promise<{ id: string }>;
}

export default async function Layout({children, params}: LayoutProps) {
    const {id} = await params;

    const userProfile: UserProfile = await lightApi.get<UserProfile>(`/api/v1/users/profiles/${id}`)
        .baseUrl(process.env.INTERNAL_API_URL ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL);

    await getAuthenticatedUser();

    return (
        <div className="h-dvh w-screen flex overflow-hidden pt-15 box-border">
            <aside className="w-sm flex flex-col items-center py-25">
                <div className="flex flex-col gap-3 items-center justify-center">
                    <Avatar className="h-25 w-25">
                        <AvatarImage src={userProfile.userProfileImageUrl ? userProfile.userProfileImageUrl : ""}/>
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                        <span className="text-lg">{userProfile.nickName}</span>
                        <span className="text-sm text-muted-foreground">{userProfile.bio}</span>
                    </div>
                </div>

                <div className="flex divide-x border-muted-foreground w-full my-5">
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-md">{userProfile.articleCount}</span>
                        <span className="text-xs text-muted-foreground">Articles</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-md">{userProfile.clusterCount}</span>
                        <span className="text-xs text-muted-foreground">Clusters</span>
                    </div>
                </div>
            </aside>

            <div className="mt-2 flex-1 flex min-h-0 flex-col overflow-hidden">
                <UserProfileNav userId={userProfile.userId}/>
                <main className="min-h-0 flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
