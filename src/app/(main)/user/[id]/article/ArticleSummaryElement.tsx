import {ArticleSummary} from "@/app/(main)/user/[id]/article/useGetNewArticleList";
import {dateConvert} from "@/lib/utils";
import Link from "next/link";


interface ArticleSummaryElementProps{
    articleSummary:ArticleSummary;
}

export default function ArticleSummaryElement({articleSummary}:ArticleSummaryElementProps){

    return(
        <Link href={`/article/${articleSummary.id}`}>
            <div className="h-56 flex flex-col justify-between border rounded-sm px-3 py-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">
                <div className="flex flex-col">
                    <span className="text-xs top-2 text-muted-foreground">{dateConvert(articleSummary.createdAt)}</span>
                    <h3 className="mb-3 line-clamp-2">{articleSummary.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground mb-3 line-clamp-3">{articleSummary.description}</span>
                <span className="text-xs text-muted-foreground">{articleSummary.commentsCount} comments</span>
            </div>
        </Link>
    )
}