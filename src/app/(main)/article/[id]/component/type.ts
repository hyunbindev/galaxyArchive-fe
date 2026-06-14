import {UserInfo} from "@/lib/getAuthenticatedUser";

export interface ArticleCommentResponse{
    id:number;
    author: CommentAuthor;
    createdAt:string;
    text:string;
    children:ArticleCommentResponse[];
    isDeleted:boolean;
}

export interface CommentAuthor{
    userId:string;
    nickName:string;
    userProfileImageUrl:string;
    bio:string;
}