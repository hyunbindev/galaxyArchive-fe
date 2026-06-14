import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical, TrashIcon} from "lucide-react";
import {UserInfo} from "@/lib/getAuthenticatedUser";
import {CommentAuthor} from "@/app/(main)/article/[id]/component/type";

interface CommentOptionProps{
    userInfo:UserInfo|null;
    authorInfo:CommentAuthor;
    onDelete:()=>void;
}

export default function CommentOption({ onDelete,userInfo,authorInfo }:CommentOptionProps){
    return(
        <div className="absolute right-0">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>

                        {authorInfo.userId == userInfo?.id && <DropdownMenuItem onClick={onDelete} variant="destructive" className="cursor-pointer text-xs">
                            <TrashIcon />
                            Delete
                        </DropdownMenuItem>}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}