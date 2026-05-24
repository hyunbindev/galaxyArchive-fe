import {ButtonGroup} from "@/components/ui/button-group";
import {WhiteButton} from "@/components/ui/white-button";
import {SquarePen} from "lucide-react";
import DeleteModal from "@/app/(main)/article/[id]/component/DeleteModal";
import {Article} from "@/app/(main)/article/[id]/getArticle";
import getAuthenticatedUser, {UserInfo} from "@/lib/getAuthenticatedUser";


interface ControllerProps{
    article:Article;
}

export default async function Controller({article}:ControllerProps){
    const userInfo:UserInfo|null = await getAuthenticatedUser();

    if(!userInfo) return;

    if(userInfo.id === article.author.id){
        return(
            <ButtonGroup>
                <WhiteButton variant="outline" className="cursor-pointer">
                    <SquarePen className="h-4 w-4" />Update
                </WhiteButton>
                <DeleteModal article={article}/>
            </ButtonGroup>
        )
    }
}