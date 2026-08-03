export interface UserProfile {
    userId: string;
    nickName: string;
    userProfileImageUrl: string | null;
    bio: string;
    articleCount: number;
    clusterCount: number;
    connectionCount: number;
}
