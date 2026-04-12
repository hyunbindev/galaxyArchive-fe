
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import MilkdownViewer from "@/components/viewer/MilkdownViewer";
import getArticle, {Article} from "@/app/(main)/article/[id]/getArticle";
import {notFound} from "next/dist/client/components/not-found";
import DynamicSkeleton from "@/components/ui/DynamicSkeleton";

//TODO-1. JSON-LD(TechArticle) 주입,
//TODO-2. remark-html로 sr-only 정적 HTML 매복,
//TODO-3. dynamic loading에 스피너/스켈레톤 추가
//TODO-4. any 타입 제거 및 PostData 인터페이스 정의

export default async function Page({ params }: { params: { id: string } }){
    const { id } = await params;

    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        return notFound();
    }

    const article:Article = await getArticle(numericId)

    const createAtDate:Date = new Date(article.createdAt)

    return(
        <main className=" max-w-4xl mx-auto bg-background pb-20">

            <div className="flex-col">
                <div className="w-full flex flex-col pt-10">
                    <span className="text-gray-500">{`${createAtDate.getFullYear()}.${createAtDate.getMonth()+1}.${createAtDate.getDate()}`}</span>
                    <h1 className="text-4xl bg-transparent">{article.title}</h1>
                    <div className="flex items-center gap-3 pt-4">
                        <Avatar className="h-8 w-8 border border-border/40">
                            <AvatarImage
                                src={article.author.profileImageUrl}
                                alt={article.author.nickName+"'s profile image"}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="text-md">{article.author.nickName}</span>
                    </div>
                </div>
            </div>


            <div className="milkdown editor prosemirror-virtual-cursor-animation">
                <div className="prose dark:prose-invert max-w-none">
                    <MilkdownViewer text={article.text}/>
                </div>
            </div>
        </main>
    )
}