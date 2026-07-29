import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import lightApi from "@/lib/ApiClient";
import {getAuthenticatedUser} from "@/lib/getAuthenticatedUser";

import UserClusterNetwork from "@/app/(main)/user/[id]/cluster/UserClusterNetwork";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface PageProps {
    params: Promise<{ id: string }>;
}

// ?ъ슜???꾨줈??API ?묐떟 ??낆엯?덈떎.
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
    // URL??[id] 媛믪쓣 爰쇰궡???대떦 ?ъ슜?먯쓽 ?꾨줈?꾩쓣 議고쉶?⑸땲??
    const { id } = await params;

    // ?쒕쾭 而댄룷?뚰듃?먯꽌 ?대? API 二쇱냼瑜??곗꽑 ?ъ슜?섍퀬, ?놁쑝硫?public API 二쇱냼瑜??ъ슜?⑸땲??
    const userProfile:UserProfile = await lightApi.get<UserProfile>(`/api/v1/users/profiles/${id}`)
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL);

    // ?꾩옱 濡쒓렇?명븳 ?ъ슜???뺣낫?낅땲?? ?꾨줈??二쇱씤怨?濡쒓렇???ъ슜?먮? 鍮꾧탳?????ъ슜?????덉뒿?덈떎.
    await getAuthenticatedUser()

    return(
        <div className="h-dvh w-screen flex overflow-hidden pt-15 box-border">
            <aside className="w-xs flex flex-col items-center py-25">
                <div className="flex flex-col gap-3 items-center justify-center">
                    <Avatar className="h-25 w-25">
                        <AvatarImage src={userProfile.userProfileImageUrl?userProfile.userProfileImageUrl:""}/>
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

            {/* ?ㅻⅨ履?硫붿씤 ?곸뿭: ?ъ슜?먯쓽 ?대윭?ㅽ꽣 ?ㅽ듃?뚰겕瑜??뚮뜑留곹빀?덈떎. */}
            <div className="mt-2 flex-1 flex min-h-0 flex-col overflow-hidden">
                <Tabs defaultValue="overview" className="h-full min-h-0 w-full">
                    <TabsList variant="line">
                        <TabsTrigger value="clusters">Cluster</TabsTrigger>
                        <TabsTrigger value="articles">Articles</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="clusters" className="min-h-0 overflow-hidden">
                        <div className="flex h-full min-h-0 w-full overflow-hidden">
                            <UserClusterNetwork userId={userProfile.userId}/>
                        </div>

                    </TabsContent>
                    <TabsContent value="articles">
                        articles
                    </TabsContent>
                    <TabsContent value="activity">
                        activities
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
