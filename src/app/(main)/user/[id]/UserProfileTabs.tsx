"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleList from "@/app/(main)/user/[id]/article/ArticleList";
import UserClusterNetwork from "@/app/(main)/user/[id]/cluster/UserClusterNetwork";

interface UserProfileTabsProps {
    userId: string;
}

export default function UserProfileTabs({ userId }: UserProfileTabsProps) {
    return (
        <Tabs defaultValue="Networks">
            <div className="">
                <TabsList variant="line">
                    <TabsTrigger className="text cursor-pointer" value="Networks">Galaxy</TabsTrigger>
                    <TabsTrigger className="text cursor-pointer" value="Articles">Articles</TabsTrigger>
                    <TabsTrigger className="text cursor-pointer" value="Activity">Activity</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="Networks" className="mb-20">
                <UserClusterNetwork userId={userId}/>
            </TabsContent>

            <TabsContent value="Articles" className="mb-20">
                <ArticleList authorId={userId}/>
            </TabsContent>

            <TabsContent value="Activity" className="mb-20">
                <div className="flex min-h-60 items-center justify-center text-sm text-muted-foreground">
                    No activity view yet.
                </div>
            </TabsContent>
        </Tabs>
    );
}
