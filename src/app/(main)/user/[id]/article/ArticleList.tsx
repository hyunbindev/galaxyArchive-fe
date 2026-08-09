"use client";

import Image from "next/image";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Eye, MessageSquare} from "lucide-react";
import {dateConvert} from "@/lib/utils";
import useGetNewArticleList, {ArticleSummary} from "@/app/(main)/user/[id]/article/useGetNewArticleList";

interface ArticleListProps {
    authorId: string;
}

interface ArticleListItemProps {
    article: ArticleSummary;
}

function ArticleListItem({article}: ArticleListItemProps) {
    return (
        <li className="w-full max-w-3xl rounded-sm border border-accent px-6 py-4 transition-all duration-300 hover:bg-accent">
            <Link href={`/article/${article.id}`} className="block">
                <div className="flex items-stretch gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-col">
                            <span className="text-xs text-muted-foreground">{dateConvert(article.createdAt)}</span>
                            <h2 className="line-clamp-2 text-lg">{article.title}</h2>
                        </div>

                        <p className="mx-1 line-clamp-3 text-sm text-muted-foreground">
                            {article.description}
                        </p>

                        <div className="my-3 flex flex-wrap gap-1">
                            {article.keywords.map((keyword) => (
                                <Badge
                                    key={keyword}
                                    className="max-w-32 truncate text-xs text-muted-foreground"
                                    variant="outline"
                                >
                                    {keyword}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {article.thumbnailUrl &&
                    <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-sm">
                        <Image
                            alt={`${article.title}'thumbnail image`}
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${article.thumbnailUrl}`}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="160px"
                        />
                    </div>
                    }
                </div>

                <div className="mt-3 flex gap-3 border-t border-t-accent px-1 pt-2">
                    <div className="flex items-center text-muted-foreground">
                        <MessageSquare size={16} className="mr-1.5 stroke-current"/>
                        <span className="text-sm">{article.commentsCount}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Eye size={16} className="mr-1.5 stroke-current"/>
                        <span className="text-sm">{article.viewCount}</span>
                    </div>
                </div>
            </Link>
        </li>
    );
}

export default function ArticleList({authorId}: ArticleListProps) {
    const {articles, hasNextPage, isLoading, requestNextPage} = useGetNewArticleList(authorId, 10);

    return (

        <div className="h-full min-h-0 w-full overflow-hidden">
            <ul
                className="no-scrollbar flex h-full w-full flex-col items-center gap-2 overflow-y-auto"
                onScroll={(event) => {
                    const target = event.currentTarget;
                    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 80;

                    if (isNearBottom && hasNextPage && !isLoading) {
                        requestNextPage().catch(console.error);
                    }
                }}
            >
                {articles.map((article) => (
                    <ArticleListItem key={article.id} article={article}/>
                ))}

                {!isLoading && articles.length === 0 && (
                    <li className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No articles yet.
                    </li>
                )}

                {isLoading && (
                    <li className="py-4 text-sm text-muted-foreground">
                        Loading...
                    </li>
                )}
            </ul>
        </div>
    );
}
