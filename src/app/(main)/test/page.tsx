"use client"
import GalaxyView from "@/components/view/@galaxyview";
import {Graph} from "@/components/view/@galaxyview/types";
import useArticleGraph from "@/app/(main)/useArticleGraph";
import useArticleGraphApi from "@/app/(main)/test/useArticleGraphApi";


export default function test (){
    const { graph } = useArticleGraphApi()


    console.log(graph)

    return(
        <div>
            <GalaxyView graph={graph}/>
        </div>
    )
}