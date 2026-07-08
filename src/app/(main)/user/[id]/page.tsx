import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import lightApi from "@/lib/ApiClient";
import {getAuthenticatedUser} from "@/lib/getAuthenticatedUser";
import {ButtonGroup} from "@/components/ui/button-group";
import ProfileEdit from "@/app/(main)/user/[id]/profile/ProfileEdit";
import UserProfileTabs from "@/app/(main)/user/[id]/UserProfileTabs";

interface PageProps {
    params: Promise<{ id: string }>;
}

export interface UserProfile{
    userId:string;
    nickName:string;
    userProfileImageUrl:string|null;
    bio:string;
    articleCount:number;
    clusterCount:number;
    connectionCount:number;
}

export default async function Page({ params }:PageProps){
    const { id } = await params;
    const userProfile:UserProfile = await lightApi.get<UserProfile>(`/api/v1/users/profiles/${id}`)
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL);
    const userInfo = await getAuthenticatedUser()

    return(
        <div className="h-screen">
            <div className="flex h-full min-h-0 flex-col max-w-7xl mx-auto bg-background">
                <div className="py-18 shrink-0">

                </div>
                <div className="ml-20 shrink-0">
                    <div className="relative flex justify-between pb-6 min-h-25">

                        <div className="absolute top-0 -translate-y-1/2">
                            <Avatar className="h-30 w-30">
                                <AvatarImage
                                    src={userProfile.userProfileImageUrl?userProfile.userProfileImageUrl:""}
                                    alt={"" + "'s profile image"}
                                />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex flex-col ml-30 p-3 gap-1">
                            <span className="text-2xl">{userProfile.nickName}</span>
                            <div className="flex flex-col gap-2 justify-center">
                                <span className="text-muted-foreground text-sm">{userProfile.bio}</span>
                            </div>
                        </div>
                        <div className="flex items-end pb-3 [&>div]:flex [&>div]:flex-col [&>div]:pr-10">
                            <div>
                                <span>{userProfile.articleCount}</span>
                                <span className="text-sm text-muted-foreground">Articles</span>
                            </div>
                            <div>
                                <span>{userProfile.connectionCount}</span>
                                <span className="text-sm text-muted-foreground">Connections</span>
                            </div>
                            <div>
                                <span>{userProfile.clusterCount}</span>
                                <span className="text-sm text-muted-foreground">Clusters</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col">
                    <UserProfileTabs userId={id} />
                </div>
            </div>
        </div>
    )
}
