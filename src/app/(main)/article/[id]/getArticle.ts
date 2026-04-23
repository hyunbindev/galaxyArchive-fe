export default async function getArticle(articleId:number):Promise<Article>{
    try {
        const response = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/articles/${articleId}`,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // TODO-조회 실패시 예외처리
            console.error(response)
        }

        return await response.json();
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