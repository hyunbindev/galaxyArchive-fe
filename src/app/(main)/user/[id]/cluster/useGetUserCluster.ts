"use client";

import { useEffect, useState } from "react";
import lightApi from "@/lib/ApiClient";
import { UserClusterSnapshot } from "@/components/view/clustergraphview/type";

export default function useGetUserCluster(userId: string) {
    const [snapshot, setSnapshot] = useState<UserClusterSnapshot | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let canceled = false;

        lightApi
            .get<UserClusterSnapshot>(`/api/v1/clusters/users/${userId}`)
            .baseUrl(process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL)
            .then((response) => {
                console.log(response)
                if (!canceled) setSnapshot(response);
            })
            .catch((err) => {
                if (!canceled) {
                    setSnapshot(null);
                    setError(err);
                }
            })
            .finally(() => {
                if (!canceled) setIsLoading(false);
            });

        return () => {
            canceled = true;
        };
    }, [userId]);

    return { snapshot, isLoading, error };
}
