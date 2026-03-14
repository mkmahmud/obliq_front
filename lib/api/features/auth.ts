import { baseApi, type BaseApi } from "@/lib/api/base-api";

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    data: {
        accessToken: string;
        user: {
            id: string;
            email: string;
            [key: string]: unknown;
        };
    };
};

export type RegisterPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    message: string;
    data: {
        accessToken: string;
        user: {
            id: string;
            email: string;
            [key: string]: unknown;
        };
    };
};

export function createAuthApi(api: BaseApi = baseApi) {
    return {
        login: async (payload: LoginPayload) => {
            const response = await api.post<LoginResponse>("/auth/login", payload, {
                withCredentials: true,
            });
            return response.data;
        },

        logout: async () => {
            const response = await api.post<{ message: string }>("/auth/logout");
            return response.data;
        },

        register: async (payload: RegisterPayload) => {
            const response = await api.post<RegisterResponse>("/auth/register", payload, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const authApi = createAuthApi();
