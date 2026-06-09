"use client"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import React, {useEffect, useMemo, useState} from "react";
import useGetNewArticleList from "@/app/(main)/user/[id]/article/useGetNewArticleList";
import ArticleSummaryElement from "@/app/(main)/user/[id]/article/ArticleSummaryElement";

interface ArticleListProps{
    authorId:string;
}

export default function ArticleList({authorId}:ArticleListProps){
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const { articleSummeryPage, lastArticleId, requestNextPage } = useGetNewArticleList(authorId,10);


    useEffect(() => {
        if (!carouselApi) return;

        const onSelect = () => {
            const currentIdx = carouselApi.selectedScrollSnap();
            const totalSlides = carouselApi.slideNodes().length;

            if (currentIdx === totalSlides - 1 && lastArticleId.current) {
                // 케러셀 에니메이션 중 요소 추가로 인한 재랜더링 끊김 현상 애니메이션 전부 재생 후 다음 페이지 호출
                setTimeout(()=>{requestNextPage().catch(console.error);},700);
            }
        };

        carouselApi.on("select", onSelect);
        return () => {
            carouselApi.off("select", onSelect);
        };
    }, [carouselApi, requestNextPage]);

    return(
        <div className="flex flex-col">
            <div className="mx-10">
                <Carousel setApi={setCarouselApi} >
                    <CarouselContent>
                        {
                            articleSummeryPage.map((page,index)=>(
                            <CarouselItem key={index}>
                                <div className="grid grid-cols-5 gap-5">
                                    {
                                        page.map((summary)=>(<ArticleSummaryElement key={summary.id} articleSummary={summary}/>))
                                    }
                                </div>
                            </CarouselItem>))
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}