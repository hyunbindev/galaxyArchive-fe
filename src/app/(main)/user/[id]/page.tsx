import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ArticleList from "@/app/(main)/user/[id]/article/ArticleList";
import lightApi from "@/lib/ApiClient";
import {UserInfo} from "@/lib/getAuthenticatedUser";

interface PageProps {
    params: Promise<{ id: string }>;
}

interface UserProfile{
    userInfo: UserInfo;
    bio:string;
    articleCount:number;
    clusterCount:number;
    connectionCount:number;
}

export default async function Page({ params }:PageProps){
    const { id } = await params;
    const userProfile:UserProfile = await lightApi.get<UserProfile>(`/api/v1/users/${id}`)
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL);

    return(
        <div className="">
            <div className="py-30 ">

            </div>
            <div className="flex flex-col max-w-7xl mx-auto bg-background">
                <div className="ml-20">
                    <div className="relative flex pb-6">

                        <div className="absolute top-0 -translate-y-1/2">
                            <Avatar className="h-40 w-40">
                                <AvatarImage
                                    src={userProfile.userInfo.profileImageUrl}
                                    alt={"" + "'s profile image"}
                                />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex flex-col ml-40 p-3 gap-1">
                            <span className="text-2xl">{userProfile.userInfo.nickName}</span>
                            <span className="text-muted-foreground text-sm">BackEndDeveloper</span>
                        </div>
                    </div>


                    <div className="flex divide-x [&>div]:flex [&>div]:flex-col [&>div]:pr-10 [&>div:not(:first-child)]:pl-5">
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


                <div className="mt-10 ml-10 mb-3">
                    <Tabs defaultValue="Articles">
                        <TabsList variant="line">
                            <TabsTrigger className="text cursor-pointer" value="Articles">Articles</TabsTrigger>
                            <TabsTrigger className="text cursor-pointer" value="Networks">Networks</TabsTrigger>
                            <TabsTrigger className="text cursor-pointer" value="Activity">Activity</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="mb-20">
                    <ArticleList authorId={id}/>
                </div>
            </div>
        </div>
    )
}