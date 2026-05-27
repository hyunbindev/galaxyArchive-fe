import RecommentElement from "@/app/(main)/article/[id]/component/comment/recomment/RecommentElement";
import RecommentAuthorInfo from "@/app/(main)/article/[id]/component/comment/recomment/RecommentAuthorInfo";
import RecommentField from "@/app/(main)/article/[id]/component/comment/CommentField";


export default function Recomment() {
    return (
        <div className="relative ml-10 py-10 pl-5
            before:absolute before:-left-5.25 before:top-0 before:h-15 before:w-10
            before:border-l before:border-b before:border-zinc-200 dark:before:border-zinc-800
            before:rounded-bl-4xl"
        >
            <div className="relative before:absolute before:left-4.75 before:top-5 before:h-full before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
                <RecommentAuthorInfo/>
                <RecommentField/>
            </div>

            <div className="flex flex-col [&>div:not(:last-child)]:pb-10">
                <RecommentElement/>
                <RecommentElement/>
            </div>
        </div>
    )
}