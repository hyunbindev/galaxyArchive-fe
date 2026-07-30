import ArticleList from "@/app/(main)/user/[id]/article/ArticleList";

interface UserArticles{
    authorId:string;
}


export default function UserArticles({authorId}:UserArticles){
    return(
        <div className="m-5">
            <ArticleList authorId={authorId}/>
        </div>
    )
}