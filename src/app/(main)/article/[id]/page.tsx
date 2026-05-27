
import MilkdownViewer from "@/components/view/MilkdownViewer";
import getArticle, {Article} from "@/app/(main)/article/[id]/getArticle";


import Controller from "@/app/(main)/article/[id]/component/Controller";
import Profile from "@/app/(main)/article/[id]/component/Profile";
import {Separator} from "@/components/ui/separator";
import CommentField from "@/app/(main)/article/[id]/component/comment/CommentField";
import AuthorInfo from "@/app/(main)/article/[id]/component/comment/AuthorInfo";
import CommentElement from "@/app/(main)/article/[id]/component/comment/CommentElement";
//TODO-2. remark-html로 sr-only 정적 HTML 매복,
//TODO-3. dynamic loading에 스피너/스켈레톤 추가

export default async function Page({params}: { params: { id: string } }) {
    const {id} = await params;

    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        throw new Error("not valid article id");
    }

    const article: Article = await getArticle(numericId)

    const createAtDate: Date = new Date(article.createdAt)

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogArticle",
        "headline": article.title,
        "datePublished": article.createdAt,
        "author": {
            "@type": "Person",
            "name": article.author.nickName,
            "image": article.author.profileImageUrl
        },
        "articleBody": article.text.substring(0, 200) // 초반 요약만
    };

    return (
        <main className=" max-w-4xl mx-auto bg-background pb-20 mt-15">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <div className="flex-col pt-10 ">
                <div className="w-full flex flex-col">
                    <span
                        className="text-gray-500">{`${createAtDate.getFullYear()}.${createAtDate.getMonth() + 1}.${createAtDate.getDate()}`}</span>

                    <h1 className="text-4xl bg-transparent">{article.title}</h1>

                    <div className="flex justify-between items-center py-4 mt-4">
                        <Profile profileImageUrl={article.author.profileImageUrl} nickName={article.author.nickName}/>
                        <Controller article={article}/>
                    </div>
                </div>
                <Separator />
            </div>


            <div className="milkdown editor prosemirror-virtual-cursor-animation">
                <div className="prose dark:prose-invert max-w-none">
                    <MilkdownViewer text={article.text}/>
                </div>
            </div>

            <Separator />
            <div className="flex flex-col py-5">
                <h3 className="py-1">Comments</h3>
                <div className="relative before:absolute before:left-[19px] before:top-5 before:h-full before:w-[1px] before:bg-zinc-200 dark:before:bg-zinc-800">
                    <AuthorInfo/>
                    <CommentField/>
                </div>
                <div className="relative before:absolute before:left-[19px] before:top-5 before:h-full before:w-[1px] before:bg-zinc-200 dark:before:bg-zinc-800">
                    <CommentElement/>
                    <CommentElement/>
                    <CommentElement/>
                    <CommentElement/>
                    <CommentElement/>
                </div>
            </div>
        </main>
    )
}