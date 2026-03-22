import api from "@/lib/api";


export default async function getArticle(articleId:number){

    try {
        const response = await api.get(`/api/v1/articles/${articleId}`);
        console.log(response);
        return response;
    }catch (err){
        console.error(err);
    }
}