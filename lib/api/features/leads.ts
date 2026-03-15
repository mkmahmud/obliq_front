import { baseApi, type BaseApi } from "@/lib/api/base-api";

type LeadUser = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
};

export type LeadItem = {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    assignedToId?: string | null;
    createdById: string;
    status?: string | null;
    createdAt?: string;
    updatedAt?: string;
    assignedTo?: LeadUser | null;
    createdBy?: LeadUser | null;
    [key: string]: unknown;
};

export type LeadsListResponse = {
    message: string;
    data: LeadItem[];
};

export type LeadSingleResponse = {
    message: string;
    data: LeadItem;
};

export type CreateLeadPayload = {
    name: string;
    email?: string;
    phone?: string;
    assignedToId?: string;
    status?: string;
};

export type UpdateLeadPayload = {
    name?: string;
    email?: string;
    phone?: string;
    assignedToId?: string;
    status?: string;
};

export function createLeadsApi(api: BaseApi = baseApi) {
    return {
        findAll: async () => {
            const response = await api.get<LeadsListResponse>("/leads", {
                withCredentials: true,
            });
            return response.data;
        },

        findOne: async (id: string) => {
            const response = await api.get<LeadSingleResponse>(`/leads/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },

        create: async (payload: CreateLeadPayload) => {
            const response = await api.post<LeadSingleResponse>("/leads", payload, {
                withCredentials: true,
            });
            return response.data;
        },

        update: async (id: string, payload: UpdateLeadPayload) => {
            const response = await api.patch<LeadSingleResponse>(`/leads/${id}`, payload, {
                withCredentials: true,
            });
            return response.data;
        },

        remove: async (id: string) => {
            const response = await api.delete<LeadSingleResponse>(`/leads/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const leadsApi = createLeadsApi();