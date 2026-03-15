import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import { clearAccessToken, getAccessToken } from "@/lib/auth/token-store";

export type BaseApi = AxiosInstance;
type RequestConfigWithSkip = {
    skipUnauthorizedRedirect?: boolean;
};

const defaultConfig: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
};

export function createBaseApi(config?: CreateAxiosDefaults): BaseApi {
    let hasRedirectedOnUnauthorized = false;

    const client = axios.create({
        ...defaultConfig,
        ...config,
        headers: {
            ...defaultConfig.headers,
            ...config?.headers,
        },
    });

    client.interceptors.request.use((requestConfig) => {
        const token = getAccessToken();

        if (token) {
            requestConfig.headers = requestConfig.headers ?? {};
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        return requestConfig;
    });

    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (typeof window !== "undefined" && error?.response?.status === 401) {
                clearAccessToken();
                const shouldSkipRedirect = Boolean((error?.config as RequestConfigWithSkip | undefined)?.skipUnauthorizedRedirect);
                const currentPath = window.location.pathname;
                const isAuthRoute = currentPath.startsWith("/login") || currentPath.startsWith("/register");

                if (!shouldSkipRedirect && !isAuthRoute && !hasRedirectedOnUnauthorized) {
                    hasRedirectedOnUnauthorized = true;
                    window.dispatchEvent(
                        new CustomEvent("app:unauthorized", {
                            detail: {
                                callbackUrl: currentPath,
                                reason: "session-expired",
                            },
                        }),
                    );
                }
            }

            return Promise.reject(error);
        },
    );

    return client;
}

export const baseApi = createBaseApi();

export const apiClient = baseApi;

