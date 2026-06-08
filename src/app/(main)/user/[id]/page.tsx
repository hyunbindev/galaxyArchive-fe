import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ArticleList from "@/app/(main)/user/[id]/article/ArticleList";


export default function Page(){
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
                                    src={"https://avatars.githubusercontent.com/u/132333588?v=5"}
                                    alt={"" + "'s profile image"}
                                />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex flex-col ml-40 p-3 gap-1">
                            <span className="text-2xl">김현빈</span>
                            <span className="text-muted-foreground text-sm">BackEndDeveloper</span>
                        </div>
                    </div>


                    <div className="flex divide-x [&>div]:flex [&>div]:flex-col [&>div]:pr-10 [&>div:not(:first-child)]:pl-5">
                        <div>
                            <span>142</span>
                            <span className="text-sm text-muted-foreground">Articles</span>
                        </div>
                        <div>
                            <span>195</span>
                            <span className="text-sm text-muted-foreground">Connections</span>
                        </div>
                        <div>
                            <span>18</span>
                            <span className="text-sm text-muted-foreground">Clusters</span>
                        </div>
                    </div>
                </div>


                <div className="mt-10 ml-10">
                    <Tabs defaultValue="Articles">
                        <TabsList variant="line">
                            <TabsTrigger className="text cursor-pointer" value="Articles">Articles</TabsTrigger>
                            <TabsTrigger className="text cursor-pointer" value="Networks">Networks</TabsTrigger>
                            <TabsTrigger className="text cursor-pointer" value="Activity">Activity</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="mb-20">
                    <h1 className="ml-12 mt-5 mb-2">New Articles</h1>
                    <ArticleList/>
                </div>
            </div>
        </div>
    )
}