import api from "@/lib/api";

export default async function getArticle(articleId:number):Promise<Article>{
    try {
        const response = await api.get<Article>(`/api/v1/articles/${articleId}`);
        return response.data;
    }catch (err){
        console.error(err);
        throw err
    }
}

export interface Article{
    id:number
    title:string
    author:Author
    text:string
    createdAt:string
}
export interface Author{
    id:string
    nickName:string
    profileImageUrl?:string
    oauth2Provider:string
}