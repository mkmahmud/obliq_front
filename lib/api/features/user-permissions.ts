import { baseApi, type BaseApi } from "@/lib/api/base-api";

export type UserPermissionsResponse = {
    message: string;
    data: unknown;
};

export type SetUserPermissionsPayload = {
    permissionIds: string[];
    permissions?: string[];
};

export function createUserPermissionsApi(api: BaseApi = baseApi) {
    return {
        getByUser: async (userId: string) => {
            const response = await api.get<UserPermissionsResponse>(`/user-permissions/${userId}`, {
                withCredentials: true,
            });
            return response.data;
        },

        setForUser: async (userId: string, payload: SetUserPermissionsPayload) => {
            const uniqueIds = Array.from(new Set(payload.permissionIds.filter(Boolean)));

            const candidatePayloads: Array<Record<string, unknown>> = [
                { permissionIds: uniqueIds },
                { permissions: uniqueIds },
                {
                    permissionIds: uniqueIds.map((permissionId) => ({
                        permissionId,
                        granted: true,
                    })),
                },
                {
                    permissions: uniqueIds.map((permissionId) => ({
                        permissionId,
                        granted: true,
                    })),
                },
                {
                    permissions: uniqueIds.map((permissionId) => ({
                        id: permissionId,
                    })),
                },
            ];

            let lastError: unknown;

            for (const body of candidatePayloads) {
                try {
                    const response = await api.put<UserPermissionsResponse>(`/user-permissions/${userId}`, body, {
                        withCredentials: true,
                    });

                    return response.data;
                } catch (error) {
                    lastError = error;
                }
            }

            throw lastError;
        },

        removeManyPermissions: async (userId: string, permissionIds: string[]) => {
            const uniqueIds = Array.from(new Set(permissionIds.filter(Boolean)));

            const results = await Promise.all(
                uniqueIds.map((permissionId) =>
                    api.delete<UserPermissionsResponse>(`/user-permissions/${userId}/${permissionId}`, {
                        withCredentials: true,
                    }),
                ),
            );

            return results[results.length - 1]?.data ?? { message: "User permissions updated successfully", data: [] };
        },

        removePermission: async (userId: string, permissionId: string) => {
            const response = await api.delete<UserPermissionsResponse>(
                `/user-permissions/${userId}/${permissionId}`,
                {
                    withCredentials: true,
                },
            );
            return response.data;
        },
    };
}

export const userPermissionsApi = createUserPermissionsApi();
