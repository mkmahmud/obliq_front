"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    permissionsApi,
    type CreatePermissionPayload,
    type PermissionItem,
} from "@/lib/api/features/permissions";
import { PermissionForm, type PermissionFormValues } from "@/components/forms/permissions/permission-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function getApiErrorMessage(error: unknown) {
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

function toCreatePayload(values: PermissionFormValues): CreatePermissionPayload {
    return {
        key: values.key.trim(),
        module: values.module.trim() as CreatePermissionPayload["module"],
        description: values.description.trim() || undefined,
    };
}

export default function PermissionsPage() {
    const queryClient = useQueryClient();
    const [editingPermission, setEditingPermission] = useState<PermissionItem | null>(null);

    const permissionsQuery = useQuery({
        queryKey: ["permissions", "list"],
        queryFn: permissionsApi.findAll,
    });

    const createMutation = useMutation({
        mutationFn: permissionsApi.create,
        onSuccess: (response) => {
            toast.success(response.message || "Permission created successfully");
            queryClient.invalidateQueries({ queryKey: ["permissions", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreatePermissionPayload }) =>
            permissionsApi.update(id, payload),
        onSuccess: (response) => {
            toast.success(response.message || "Permission updated successfully");
            queryClient.invalidateQueries({ queryKey: ["permissions", "list"] });
            setEditingPermission(null);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: permissionsApi.remove,
        onSuccess: (response, deletedId) => {
            toast.success(response.message || "Permission deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["permissions", "list"] });
            if (editingPermission?.id === deletedId) {
                setEditingPermission(null);
            }
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const permissions = useMemo(() => permissionsQuery.data?.data ?? [], [permissionsQuery.data?.data]);

    const handleCreate = (values: PermissionFormValues) => {
        createMutation.mutate(toCreatePayload(values));
    };

    const handleUpdate = (values: PermissionFormValues) => {
        if (!editingPermission) {
            return;
        }

        updateMutation.mutate({
            id: editingPermission.id,
            payload: toCreatePayload(values),
        });
    };

    const handleDelete = (permission: PermissionItem) => {
        const confirmed = window.confirm(`Delete permission "${permission.key}"?`);

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(permission.id);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Permissions</h1>
                <p className="text-sm text-muted-foreground">
                    Manage permission atoms used by role and user access control.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Permission List</CardTitle>
                        <CardDescription>All permissions available in the system.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {permissionsQuery.isLoading ? (
                            <p className="text-sm text-muted-foreground">Loading permissions...</p>
                        ) : permissionsQuery.isError ? (
                            <p className="text-sm text-destructive">Failed to load permissions.</p>
                        ) : permissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No permissions found.</p>
                        ) : (
                            permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{permission.key}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Module: <span className="font-medium">{permission.module}</span>
                                            </p>
                                            {permission.description ? (
                                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                                            ) : null}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-auto"
                                                onClick={() => setEditingPermission(permission)}
                                            >
                                                <Pencil className="mr-1 size-3.5" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="w-auto"
                                                onClick={() => handleDelete(permission)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="mr-1 size-3.5" /> Delete
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        <span>Roles: {permission.assignedRolesCount ?? 0}</span>
                                        <span>Users: {permission.assignedUsersCount ?? 0}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{editingPermission ? "Edit Permission" : "Create Permission"}</CardTitle>
                        <CardDescription>
                            {editingPermission
                                ? "Update selected permission details."
                                : "Create a new permission atom for RBAC control."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editingPermission ? (
                            <PermissionForm
                                mode="edit"
                                initialValues={{
                                    key: editingPermission.key,
                                    module: editingPermission.module,
                                    description: editingPermission.description ?? "",
                                }}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingPermission(null)}
                                isSubmitting={updateMutation.isPending}
                            />
                        ) : (
                            <PermissionForm
                                mode="create"
                                onSubmit={handleCreate}
                                isSubmitting={createMutation.isPending}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
