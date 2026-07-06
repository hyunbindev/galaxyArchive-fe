"use client";

import ClusterGraphView from "@/components/view/clustergraphview/ClusterGraphView";
import useGetUserCluster from "@/app/(main)/user/[id]/cluster/useGetUserCluster";
import { Spinner } from "@/components/ui/spinner";

interface UserClusterNetworkProps {
    userId: string;
}

export default function UserClusterNetwork({ userId }: UserClusterNetworkProps) {
    const { snapshot, isLoading, error } = useGetUserCluster(userId);

    if (isLoading) {
        return (
            <div className="flex min-h-[520px] items-center justify-center border-y">
                <Spinner />
            </div>
        );
    }

    if (error || !snapshot) {
        return (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-2 border-y text-center">
                <h3 className="text-base font-medium">No cluster snapshot</h3>
                <p className="text-sm text-muted-foreground">
                    This user does not have a completed cluster map yet.
                </p>
            </div>
        );
    }

    return <ClusterGraphView snapshot={snapshot} />;
}
