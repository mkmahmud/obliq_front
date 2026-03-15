import { baseApi, type BaseApi } from "@/lib/api/base-api";

export type UserRole = "admin" | "manager" | "agent" | "customer";
export type UserStatus = "active" | "suspended" | "banned";

export type UserItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status?: UserStatus;
    role?: UserRole | { id?: string; name?: UserRole;[key: string]: unknown };
    managerId?: string | null;
    roleId?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
};

export type UsersListResponse = {
    message: string;
    data: UserItem[];
};

export type UserSingleResponse = {
    message: string;
    data: UserItem;
};

export type CreateUserPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    managerId?: string;
};

export type UpdateUserPayload = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    managerId?: string;
};

export function createUsersApi(api: BaseApi = baseApi) {
    return {
        findAll: async () => {
            const response = await api.get<UsersListResponse>("/users", {
                withCredentials: true,
            });
            return response.data;
        },

        findOne: async (id: string) => {
            const response = await api.get<UserSingleResponse>(`/users/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },

        create: async (payload: CreateUserPayload) => {
            const response = await api.post<UserSingleResponse>("/users", payload, {
                withCredentials: true,
            });
            return response.data;
        },

        update: async (id: string, payload: UpdateUserPayload) => {
            const response = await api.patch<UserSingleResponse>(`/users/${id}`, payload, {
                withCredentials: true,
            });
            return response.data;
        },

        suspend: async (id: string) => {
            const response = await api.patch<UserSingleResponse>(`/users/${id}/suspend`, undefined, {
                withCredentials: true,
            });
            return response.data;
        },

        ban: async (id: string) => {
            const response = await api.patch<UserSingleResponse>(`/users/${id}/ban`, undefined, {
                withCredentials: true,
            });
            return response.data;
        },

        activate: async (id: string) => {
            const response = await api.patch<UserSingleResponse>(`/users/${id}/activate`, undefined, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const usersApi = createUsersApi();
