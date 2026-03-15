import { baseApi, type BaseApi } from "@/lib/api/base-api";

type ReportUser = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
};

export type ReportItem = {
    id: string;
    title: string;
    type: string;
    data?: unknown;
    createdById: string;
    createdAt?: string;
    createdBy?: ReportUser | null;
    [key: string]: unknown;
};

export type ReportsListResponse = {
    message: string;
    data: ReportItem[];
};

export type ReportSingleResponse = {
    message: string;
    data: ReportItem;
};

export type CreateReportPayload = {
    title: string;
    type: string;
    data?: unknown;
};

export type UpdateReportPayload = {
    title?: string;
    type?: string;
    data?: unknown;
};

export function createReportsApi(api: BaseApi = baseApi) {
    return {
        findAll: async () => {
            const response = await api.get<ReportsListResponse>("/reports", {
                withCredentials: true,
            });
            return response.data;
        },

        findOne: async (id: string) => {
            const response = await api.get<ReportSingleResponse>(`/reports/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },

        create: async (payload: CreateReportPayload) => {
            const response = await api.post<ReportSingleResponse>("/reports", payload, {
                withCredentials: true,
            });
            return response.data;
        },

        update: async (id: string, payload: UpdateReportPayload) => {
            const response = await api.patch<ReportSingleResponse>(`/reports/${id}`, payload, {
                withCredentials: true,
            });
            return response.data;
        },

        remove: async (id: string) => {
            const response = await api.delete<ReportSingleResponse>(`/reports/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const reportsApi = createReportsApi();