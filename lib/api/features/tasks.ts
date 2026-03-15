import { baseApi, type BaseApi } from "@/lib/api/base-api";

export type TaskStatus = "pending" | "in_progress" | "completed";

type TaskUser = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
};

export type TaskItem = {
    id: string;
    title: string;
    description?: string | null;
    assignedToId?: string | null;
    createdById: string;
    status: TaskStatus;
    dueDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
    assignedTo?: TaskUser | null;
    createdBy?: TaskUser | null;
    [key: string]: unknown;
};

export type TasksListResponse = {
    message: string;
    data: TaskItem[];
};

export type TaskSingleResponse = {
    message: string;
    data: TaskItem;
};

export type CreateTaskPayload = {
    title: string;
    description?: string;
    assignedToId?: string;
    status?: TaskStatus;
    dueDate?: string;
};

export type UpdateTaskPayload = {
    title?: string;
    description?: string;
    assignedToId?: string;
    status?: TaskStatus;
    dueDate?: string;
};

export function createTasksApi(api: BaseApi = baseApi) {
    return {
        findAll: async () => {
            const response = await api.get<TasksListResponse>("/tasks", {
                withCredentials: true,
            });
            return response.data;
        },

        findAssignedToMe: async () => {
            const response = await api.get<TasksListResponse>("/tasks/assigned-to-me", {
                withCredentials: true,
            });
            return response.data;
        },

        findOne: async (id: string) => {
            const response = await api.get<TaskSingleResponse>(`/tasks/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },

        create: async (payload: CreateTaskPayload) => {
            const response = await api.post<TaskSingleResponse>("/tasks", payload, {
                withCredentials: true,
            });
            return response.data;
        },

        update: async (id: string, payload: UpdateTaskPayload) => {
            const response = await api.patch<TaskSingleResponse>(`/tasks/${id}`, payload, {
                withCredentials: true,
            });
            return response.data;
        },

        remove: async (id: string) => {
            const response = await api.delete<TaskSingleResponse>(`/tasks/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
    };
}

export const tasksApi = createTasksApi();