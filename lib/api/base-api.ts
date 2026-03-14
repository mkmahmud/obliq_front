import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

export type BaseApi = AxiosInstance;

const defaultConfig: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
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

