"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/features/auth";
import { normalizePermissionKeys } from "@/lib/auth/permission-utils";

type MyPermissionsResponse = {
    message: string;
    data: {
        permissions: string[];
    };
};

export function useMyPermissions() {
    return useQuery({
        queryKey: ["auth", "me", "permissions"],
        queryFn: async () => {
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
                try {
                    const me = await authApi.me();
                    const roleValue = String(me?.data?.role ?? "").toLowerCase();

                    if (roleValue === "admin") {
                        return {
                            message: "Permissions inferred from admin role",
                            data: { permissions: ["*"] },
                        } satisfies MyPermissionsResponse;
                    }
                } catch {
                    // no-op fallback
                }

                return {
                    message: "Permissions unavailable",
                    data: { permissions: [] },
                } satisfies MyPermissionsResponse;
            }
        },
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: false,
    });
}
