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

export function createAuthApi(api: BaseApi = baseApi) {
    return {
        login: async (payload: LoginPayload) => {
            const response = await api.post<LoginResponse>("/auth/login", payload);
            return response.data;
        },
    };
}

export const authApi = createAuthApi();
