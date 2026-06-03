import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical, TrashIcon} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentOptionProps{
    onDelete:()=>void;
}

export default function CommentOption({onDelete}:CommentOptionProps){
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
                        <DropdownMenuItem onClick={onDelete} variant="destructive" className="cursor-pointer text-xs">
                            <TrashIcon />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}