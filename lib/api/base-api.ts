import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import { getAccessToken } from "@/lib/auth/token-store";

export type BaseApi = AxiosInstance;

const defaultConfig: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
};

export function createBaseApi(config?: CreateAxiosDefaults): BaseApi {
    const client = axios.create({
        ...defaultConfig,
        ...config,
        headers: {
            ...defaultConfig.headers,
            ...config?.headers,
        },
    });

    client.interceptors.request.use((requestConfig) => {
        if (typeof window !== "undefined") {
            const token = getAccessToken();

            if (token) {
                requestConfig.headers = requestConfig.headers ?? {};
                requestConfig.headers.Authorization = `Bearer ${token}`;
            }
        }

        return requestConfig;
    });

    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            return Promise.reject(error);
        },
    );

    return client;
}

export const baseApi = createBaseApi();

export const apiClient = baseApi;

