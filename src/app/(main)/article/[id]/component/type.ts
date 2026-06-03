import {UserInfo} from "@/lib/getAuthenticatedUser";

export interface ArticleCommentResponse{
    id:number;
    author: UserInfo;
    createdAt:string;
    text:string;
    children:ArticleCommentResponse[];
    isDeleted:boolean;
}