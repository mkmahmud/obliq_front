"use client";

import { useQuery } from "@tanstack/react-query";

type MyPermissionsResponse = {
    message: string;
    data?: unknown;
    permissions?: unknown;
};

export function useMyPermissions() {
    return useQuery({
        queryKey: ["auth", "me", "permissions"],
        queryFn: async () => {
            const response = await fetch("/api/auth/me/permissions", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Unable to fetch permissions");
            }

            return (await response.json()) as MyPermissionsResponse;
        },
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
