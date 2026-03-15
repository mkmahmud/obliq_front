import { baseApi, type BaseApi } from "@/lib/api/base-api";

export type AuditLogItem = {
    id: string;
    actorId?: string | null;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    meta?: unknown;
    ipAddress?: string | null;
    createdAt: string;
    actor?: {
        id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        [key: string]: unknown;
    } | null;
    [key: string]: unknown;
};

export type AuditLogsListData = {
    items?: AuditLogItem[];
    data?: AuditLogItem[];
    records?: AuditLogItem[];
    page?: number;
    limit?: number;
    total?: number;
    totalItems?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
} | AuditLogItem[];

export type AuditLogsListResponse = {
    message: string;
    data: AuditLogsListData;
};

export type AuditLogSingleResponse = {
    message: string;
    data: AuditLogItem;
};

export function createAuditLogsApi(api: BaseApi = baseApi) {
    return {
        findAll: async (page = 1, limit = 20) => {
            const response = await api.get<AuditLogsListResponse>("/audit-logs", {
                params: { page, limit },
                withCredentials: true,
            });
            return response.data;
        },

        findOne: async (id: string) => {
            const response = await api.get<AuditLogSingleResponse>(`/audit-logs/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const auditLogsApi = createAuditLogsApi();