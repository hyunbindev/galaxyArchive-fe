import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
export default async function Page(){
    return(
        <main className="max-w-6xl mx-auto bg-background min-h-full pb-20">
            <div className="flex-col">
                <div className="w-full flex flex-col pt-10">
                    <span className="text-gray-500">2026.03.22</span>
                    <h2 className="text-4xl bg-transparent">title</h2>
                </div>
            </div>
            <div className="milkdown editor prosemirror-virtual-cursor-animation">
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {"## hello"}
                    </ReactMarkdown>
                </div>
            </div>
        </main>
    )
}