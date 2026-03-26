import { unified } from 'unified';
import remarkParse from 'remark-parse';
import {Skeleton} from "@/components/ui/skeleton";
interface Props {
    markdown: string;
}

// TODO: Implement skeleton rendering that matches the HTML structure.
export default function DynamicSkeleton({markdown}:Props){
    const processor = unified().use(remarkParse);
    const astNode = processor.parse(markdown);

    return astNode.children.map(node => {
        switch(node.type) {
            case 'heading':
                return <Skeleton className="h-5" />; // 깊이에 따라 길이 조절
            case 'paragraph':
                return <Skeleton />;
            case 'code':
                return <Skeleton />;
            default:
                return <Skeleton />;
        }
    });
}