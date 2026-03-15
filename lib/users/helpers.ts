import { AxiosError } from "axios";

import { type UserFormValues } from "@/components/forms/users/user-form";
import {
    type CreateUserPayload,
    type UpdateUserPayload,
    type UserItem,
} from "@/lib/api/features/users";

export function getApiErrorMessage(error: unknown) {
    const axiosError = error as AxiosError<{ message?: string | string[] }>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) {
        return message[0] || "Something went wrong.";
    }

    if (typeof message === "string" && message.trim().length > 0) {
        return message;
    }

    return "Something went wrong.";
}

export function extractRoleName(role: UserItem["role"]) {
    if (typeof role === "string") {
        return role;
    }

    if (role && typeof role === "object" && "name" in role) {
        const value = (role as { name?: unknown }).name;
        return typeof value === "string" ? value : "unknown";
    }

    return "unknown";
}

export function toCreatePayload(values: UserFormValues): CreateUserPayload {
    return {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
        managerId: values.managerId.trim() || undefined,
    };
}

export function toUpdatePayload(values: UserFormValues): UpdateUserPayload {
    return {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        role: values.role,
        managerId: values.managerId.trim() || undefined,
        password: values.password.trim() || undefined,
    };
}

export function extractPermissionRefs(source: unknown): string[] {
    if (!source) {
        return [];
    }

    if (Array.isArray(source)) {
        return source
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                if (item && typeof item === "object") {
                    const record = item as Record<string, unknown>;
                    const permission = record.permission;

                    if (permission && typeof permission === "object") {
                        const permissionRecord = permission as Record<string, unknown>;
                        const nestedId = permissionRecord.id;
                        if (typeof nestedId === "string") {
                            return nestedId;
                        }

                        const nestedKey = permissionRecord.key;
                        if (typeof nestedKey === "string") {
                            return nestedKey;
                        }
                    }

                    const idOrKey =
                        record.permissionId ??
                        record.permission_id ??
                        record.permissionID ??
                        record.permissionKey ??
                        record.key ??
                        record.id;
                    return typeof idOrKey === "string" ? idOrKey : null;
                }

                return null;
            })
            .filter((value): value is string => typeof value === "string");
    }

    if (source && typeof source === "object") {
        const record = source as Record<string, unknown>;

        const nested = record.permissions ?? record.items ?? record.data;
        return extractPermissionRefs(nested);
    }

    return [];
}