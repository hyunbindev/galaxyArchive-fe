import ArticleGraphView from "@/components/view/ArticleGraphView";
import useArticleGraph from "@/app/(main)/useArticleGraph";
import MainArticleGraphView from "@/app/(main)/MainArticleGraphView";

export default function Home() {
    return (
      <>
          <main>
              <MainArticleGraphView/>
          </main>
      </>
    );
}
