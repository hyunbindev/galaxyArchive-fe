import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import lightApi from "@/lib/ApiClient";
import {getAuthenticatedUser} from "@/lib/getAuthenticatedUser";

import UserClusterNetwork from "@/app/(main)/user/[id]/cluster/UserClusterNetwork";

interface PageProps {
    params: Promise<{ id: string }>;
}

// 사용자 프로필 API 응답 타입입니다.
export interface UserProfile{
    userId:string;
    nickName:string;
    userProfileImageUrl:string|null;
    bio:string;
    articleCount:number;
    clusterCount:number;
    connectionCount:number;
}

export default async function Page({ params }:PageProps){
    // URL의 [id] 값을 꺼내서 해당 사용자의 프로필을 조회합니다.
    const { id } = await params;

    // 서버 컴포넌트에서 내부 API 주소를 우선 사용하고, 없으면 public API 주소를 사용합니다.
    const userProfile:UserProfile = await lightApi.get<UserProfile>(`/api/v1/users/profiles/${id}`)
        .baseUrl(process.env.INTERNAL_API_URL? process.env.INTERNAL_API_URL:process.env.NEXT_PUBLIC_API_URL);

    // 현재 로그인한 사용자 정보입니다. 프로필 주인과 로그인 사용자를 비교할 때 사용할 수 있습니다.
    const userInfo = await getAuthenticatedUser()

    return(
        <div className="h-screen w-screen flex pt-15">
            {/* 왼쪽 사이드바: 프로필 이미지, 닉네임, 소개, 통계 영역 */}
            <aside className="w-xs flex flex-col items-center py-25">
                <div className="flex flex-col gap-3 items-center justify-center">
                    <Avatar className="h-25 w-25">
                        <AvatarImage src={userProfile.userProfileImageUrl?userProfile.userProfileImageUrl:""}/>
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                        <span className="text-lg">{userProfile.nickName}</span>
                        <span className="text-sm text-muted-foreground">{userProfile.bio}</span>
                    </div>
                </div>

                <div className="flex divide-x border-muted-foreground w-full my-5">
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-md">{userProfile.articleCount}</span>
                        <span className="text-xs text-muted-foreground">Articles</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-md">{userProfile.clusterCount}</span>
                        <span className="text-xs text-muted-foreground">Clusters</span>
                    </div>
                </div>
            </aside>

            {/* 오른쪽 메인 영역: 사용자의 클러스터 네트워크를 렌더링합니다. */}
            <div className="flex-1 flex flex-col">
                <div className="h-full w-full">
                    <UserClusterNetwork userId={userProfile.userId}/>
                </div>
            </div>
        </div>
    )
}
