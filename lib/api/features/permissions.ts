import { baseApi, type BaseApi } from "@/lib/api/base-api";

export type PermissionModule =
    | "dashboard"
    | "users"
    | "leads"
    | "tasks"
    | "reports"
    | "audit_logs"
    | "customer_portal"
    | "settings"
    | "permission";

export type PermissionItem = {
    id: string;
    key: string;
    module: string;
    description?: string | null;
    assignedRolesCount?: number;
    assignedUsersCount?: number;
    createdAt?: string;
    [key: string]: unknown;
};

export type PermissionListResponse = {
    message: string;
    data: PermissionItem[];
};

export type PermissionSingleResponse = {
    message: string;
    data: PermissionItem;
};

export type CreatePermissionPayload = {
    key: string;
    module: PermissionModule;
    description?: string;
};

export type UpdatePermissionPayload = {
    key?: string;
    module?: PermissionModule;
    description?: string;
};

export function createPermissionsApi(api: BaseApi = baseApi) {
    return {
        findAll: async () => {
            const response = await api.get<PermissionListResponse>("/permissions", {
                withCredentials: true,
            });
            return response.data;
        },

        findOne: async (id: string) => {
            const response = await api.get<PermissionSingleResponse>(`/permissions/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },

        create: async (payload: CreatePermissionPayload) => {
            const response = await api.post<PermissionSingleResponse>("/permissions", payload, {
                withCredentials: true,
            });
            return response.data;
        },

        update: async (id: string, payload: UpdatePermissionPayload) => {
            const response = await api.patch<PermissionSingleResponse>(`/permissions/${id}`, payload, {
                withCredentials: true,
            });
            return response.data;
        },

        remove: async (id: string) => {
            const response = await api.delete<PermissionSingleResponse>(`/permissions/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const permissionsApi = createPermissionsApi();
