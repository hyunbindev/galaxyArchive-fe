
import MilkdownViewer from "@/components/view/MilkdownViewer";
import getArticle, {Article} from "@/app/(main)/article/[id]/getArticle";


import Profile from "@/app/(main)/article/[id]/component/Profile";
import {Separator} from "@/components/ui/separator";
import getAuthenticatedUser from "@/lib/getAuthenticatedUser";
import ArticleComment from "@/app/(main)/article/[id]/component/ArticleComment";
import {getComments} from "@/app/(main)/article/[id]/component/comment/recomment/getComment";
import ArticleOption from "@/app/(main)/article/[id]/component/ArticleOption";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
//TODO-2. remark-html로 sr-only 정적 HTML 매복,
//TODO-3. dynamic loading에 스피너/스켈레톤 추가

export default async function Page({params}: { params: { id: string } }) {
    const {id} = await params;
    const userInfo = await getAuthenticatedUser();


    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        throw new Error("not valid article id");
    }
    const comments = await getComments(numericId)


    const article: Article = await getArticle(numericId)

    console.log(article)

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
        <main className="max-w-4xl mx-auto bg-background pb-20 mt-15">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <div className="flex-col pt-10 ">
                <div className="w-full flex flex-col">
                    <span className="text-gray-500">{`${createAtDate.getFullYear()}.${createAtDate.getMonth() + 1}.${createAtDate.getDate()}`}</span>

                    <h1 className="text-3xl bg-transparent">{ article.title }</h1>
                        <div className="flex gap-1 py-3">
                            {
                                article.keywords.map((keyword)=>(<Badge key={keyword} className="text-sm px-4 py-1" variant="outline">{keyword}</Badge>))
                            }
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <Link href={`/user/${article.author.id}`}>
                                <Profile profileImageUrl={article.author.profileImageUrl} nickName={ article.author.nickName } bio={ article.author.bio}/>
                            </Link>
                            <ArticleOption article={article}/>
                        </div>

                </div>
                <Separator/>
            </div>


            <div className="milkdown editor prosemirror-virtual-cursor-animation">
                <div className="prose dark:prose-invert max-w-none">
                    <MilkdownViewer text={article.text}/>
                </div>
            </div>

            <Separator/>
            <ArticleComment userInfo={userInfo} articleId={numericId} comments={comments}/>
        </main>
    )
}