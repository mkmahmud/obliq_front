"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/features/auth";
import { getAccessToken, setAccessToken } from "@/lib/auth/token-store";

type MyPermissionsResponse = {
    message: string;
    data: {
        permissions: string[];
    };
};

function getAccessTokenFromRefreshResponse(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    const record = payload as Record<string, unknown>;

    if (typeof record.accessToken === "string" && record.accessToken) {
        return record.accessToken;
    }

    const data = record.data;
    if (data && typeof data === "object") {
        const nested = data as Record<string, unknown>;
        if (typeof nested.accessToken === "string" && nested.accessToken) {
            return nested.accessToken;
        }
    }

    return null;
}

export function useMyPermissions() {
    return useQuery({
        queryKey: ["auth", "me", "permissions"],
        queryFn: async () => {
            if (!getAccessToken()) {
                const refreshPayload = await authApi.refresh();
                const token = getAccessTokenFromRefreshResponse(refreshPayload);

                if (token) {
                    setAccessToken(token);
                }
            }

            return authApi.myPermissions() as Promise<MyPermissionsResponse>;
        },
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
