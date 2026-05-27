import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import RecommentField from "@/app/(main)/article/[id]/component/comment/CommentField";
import RecommentAuthorInfo from "@/app/(main)/article/[id]/component/comment/recomment/RecommentAuthorInfo";


export default function RecommentElement(){
    return(
    <>
        <div className="relative before:absolute before:left-[19px] before:top-5 before:h-full before:w-[1px] before:bg-zinc-200 dark:before:bg-zinc-800">
            <span className="absolute -top-2 left-1 ml-12 text-xs text-gray-500">2026.10.5</span>
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/40">
                    <AvatarImage
                        src={""}
                        alt={"" + "'s profile image"}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-lg">김현빈</span>
            </div>
            <div className="ml-14 text-gray-700 dark:text-gray-400">
                우연히 장기근속 굿즈를 보고, 너무 예뻐서 직원들이 참 좋아했겠다 싶었습니다. 하지만 글을 다 읽기 전까지 이건 저의 착각이었어요. '좋았겠다'로 끝낼 문제가 아니네요. 제작 배경부터 직원들에게 전달되는 과정을 보고 무한 감동이 밀려왔습니다. 타사 재직중인데, 이런 마인드와 실행력이 있는 분과 함께 일하고 싶다는 생각까지 들게 되네요. 일을 하다보면 내가 진행하고 싶다고 기획이 실현 되는것도 아니잖아요. 비슷한 생각과 같은 방향성을 가진 분들이 모여 좋은 회사를 만든다고 생각합니다. 물론 좋은 방향으로요.^^ 기획자님께 좋은 영향 받고 갑니다. 건승하시길 바랍니다!
            </div>
        </div>
    </>
    )
}