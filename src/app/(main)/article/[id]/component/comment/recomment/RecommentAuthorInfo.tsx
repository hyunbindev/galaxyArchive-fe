import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


export default function RecommentAuthorInfo(){
    return(
        <div className="flex items-center gap-3 pb-3">
            <Avatar className="h-10 w-10 border border-border/40">
                <AvatarImage
                    src={""}
                    alt={"" + "'s profile image"}
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-lg">김현빈</span>
        </div>
    )
}