import UserClusterNetwork from "@/app/(main)/user/[id]/cluster/UserClusterNetwork";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({params}: PageProps) {
    const {id} = await params;

    return (
        <div className="flex h-full min-h-0 w-full overflow-hidden">
            <UserClusterNetwork userId={id}/>
        </div>
    );
}
