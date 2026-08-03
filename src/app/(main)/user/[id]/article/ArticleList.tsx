import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {MessageSquare} from "lucide-react";

interface ArticleListProps {
    authorId: string;
}

export default function ArticleList({ authorId }: ArticleListProps) {
    return (
        <div className="h-full min-h-0 w-full overflow-hidden">
            <ul className="flex h-full w-full flex-col items-center gap-2 overflow-y-auto">
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
                <li className="w-3xl rounded-sm border border-accent py-4 px-6 hover:bg-accent cursor-pointer transition-all duration-300">
                    <div className="flex items-stretch gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col">
                                <span className="text-xs text-muted-foreground">2026.01.06</span>
                                <h1 className="text-lg">게시글 제목</h1>
                            </div>

                            <p className="text-sm text-muted-foreground mx-1">
                                게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary게시글 summary
                            </p>
                            <div className="flex my-3 gap-1">
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                                <Badge
                                    className="text-xs text-muted-foreground truncate"
                                    variant="outline">
                                    키워드1
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-40 shrink-0 overflow-hidden rounded-sm">
                            <Image
                                alt="image describe"
                                src="https://picsum.photos/800/600"
                                fill
                                className="object-cover"
                                sizes="160px"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 border-t border-t-accent px-1 mt-3 pt-2">
                        <div className="flex text-muted-foreground items-center">
                            <MessageSquare size={16} className="stroke-current mr-1.5"/>
                            <span className="text-sm">12</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}
