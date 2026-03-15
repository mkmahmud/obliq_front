"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/features/auth";
import { getAccessToken, setAccessToken } from "@/lib/auth/token-store";
import { userPermissionsApi } from "@/lib/api/features/user-permissions";
import { normalizePermissionKeys } from "@/lib/auth/permission-utils";

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

async function ensureAccessToken() {
    if (getAccessToken()) {
        return;
    }

    try {
        const refreshPayload = await authApi.refresh();
        const token = getAccessTokenFromRefreshResponse(refreshPayload);

        if (token) {
            setAccessToken(token);
        }
    } catch {
        // Ignore and let downstream requests decide auth state.
    }
}

export function useMyPermissions() {
    return useQuery({
        queryKey: ["auth", "me", "permissions"],
        queryFn: async () => {
            await ensureAccessToken();

            try {
                const aggregated = await authApi.myPermissions();
                const aggregatedRecord = aggregated.data as Record<string, unknown> | undefined;
                const aggregatedKeys = normalizePermissionKeys(
                    aggregatedRecord?.permissions ?? aggregated.data,
                );

                if (aggregatedKeys.length > 0) {
                    return {
                        message: aggregated.message || "Permissions retrieved successfully",
                        data: {
                            permissions: aggregatedKeys,
                        },
                    } satisfies MyPermissionsResponse;
                }
            } catch {
                // Continue to user-specific fallback.
            }

            try {
                await ensureAccessToken();

                const me = await authApi.me();
                const userId = me.data?.id;

                if (!userId) {
                    return {
                        message: "No user found",
                        data: { permissions: [] },
                    } satisfies MyPermissionsResponse;
                }

                const userPermissions = await userPermissionsApi.getByUser(userId);
                const strictKeys = normalizePermissionKeys(userPermissions.data);

                return {
                    message: userPermissions.message || "User permissions retrieved successfully",
                    data: {
                        permissions: strictKeys,
                    },
                } satisfies MyPermissionsResponse;
            } catch {
                return {
                    message: "Permissions unavailable",
                    data: { permissions: [] },
                } satisfies MyPermissionsResponse;
            }
        },
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
