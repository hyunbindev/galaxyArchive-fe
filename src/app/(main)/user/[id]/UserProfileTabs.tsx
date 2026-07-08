"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleList from "@/app/(main)/user/[id]/article/ArticleList";
import UserClusterNetwork from "@/app/(main)/user/[id]/cluster/UserClusterNetwork";

interface UserProfileTabsProps {
    userId: string;
}

export default function UserProfileTabs({ userId }: UserProfileTabsProps) {
    return (
        <Tabs defaultValue="Networks" className="h-full min-h-0">
            <div className="flex shrink-0 flex-col">
                <TabsList variant="line">
                    <TabsTrigger className="text cursor-pointer" value="Networks">Galaxy</TabsTrigger>
                    <TabsTrigger className="text cursor-pointer" value="Articles">Articles</TabsTrigger>
                    <TabsTrigger className="text cursor-pointer" value="Activity">Activity</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="Networks" className="mb-0 flex min-h-0 flex-col">
                <UserClusterNetwork userId={userId}/>
            </TabsContent>

            <TabsContent value="Articles" className="mb-0 flex min-h-0 flex-col">
                <ArticleList authorId={userId}/>
            </TabsContent>

            <TabsContent value="Activity" className="mb-0 flex min-h-0 flex-col">
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No activity view yet.
                </div>
            </TabsContent>
        </Tabs>
    );
}
