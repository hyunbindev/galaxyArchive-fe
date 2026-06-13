
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";



interface ProfileProps{
    profileImageUrl?:string;
    nickName?:string;
    bio?:string;
}

export default function Profile({profileImageUrl, nickName, bio}:ProfileProps){
    return(
        <div className="flex items-center gap-3">

            <Avatar className="h-8 w-8 border border-border/40">
                <AvatarImage
                    src={profileImageUrl}
                    alt={nickName + "'s profile image"}
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0">
                <span>{nickName}</span>
                <span className="text-xs text-muted-foreground">{bio}</span>
            </div>
        </div>
    )
}