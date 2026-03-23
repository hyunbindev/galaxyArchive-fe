import { unified } from 'unified';
import remarkParse from 'remark-parse';
import {Skeleton} from "@/components/ui/skeleton";
interface Props {
    markdown: string;
}

// TODO: Implement skeleton rendering that matches the HTML structure.
export default function DynamicSkeleton({markdown}:Props){
    const processor = unified().use(remarkParse);
    const ast = processor.parse(markdown);

    console.log(ast);

    return (
        <div>

        </div>
    )
}