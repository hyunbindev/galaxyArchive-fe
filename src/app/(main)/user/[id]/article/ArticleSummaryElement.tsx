import {ArticleSummary} from "@/app/(main)/user/[id]/article/useGetNewArticleList";
import {dateConvert} from "@/lib/utils";
import Link from "next/link";
import {MessageSquare} from "lucide-react";
import {Badge} from "@/components/ui/badge";


interface ArticleSummaryElementProps{
    articleSummary:ArticleSummary;
}

export default function ArticleSummaryElement({articleSummary}:ArticleSummaryElementProps){

    return(
        <Link href={`/article/${articleSummary.id}`}>
            <div className="flex h-60 flex-col justify-between border rounded-sm px-3 py-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">
                <div className="flex flex-col mx-1">
                    <span className="text-xs top-2 text-muted-foreground">{dateConvert(articleSummary.createdAt)}</span>
                    <h3 className="mb-3 line-clamp-2">{articleSummary.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground line-clamp-2 mx-1">{articleSummary.description}</span>
                <div className="py-2 gap-1 h-8 line-clamp-1">
                    {
                        articleSummary.keywords.map((keyword,idx)=>(<Badge key={idx} className="text-xs my-0.5 ml-0.5 text-muted-foreground shrink-0" variant="outline">{keyword}</Badge>))
                    }
                </div>
                <div className="flex text-muted-foreground mx-2">
                    <MessageSquare size={15} className="stroke-current mr-1.5"/>
                    <span className="text-xs">{articleSummary.commentsCount}</span>
                </div>

            </div>
        </Link>
    )
}