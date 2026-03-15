"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    usersApi,
    type UpdateUserPayload,
    type UserItem,
} from "@/lib/api/features/users";
import { authApi } from "@/lib/api/features/auth";
import { permissionsApi } from "@/lib/api/features/permissions";
import { userPermissionsApi } from "@/lib/api/features/user-permissions";
import {
    extractPermissionRefs,
    extractRoleName,
    getApiErrorMessage,
    toCreatePayload,
    toUpdatePayload,
} from "@/lib/users/helpers";
import { type UserFormValues } from "@/components/forms/users/user-form";
import { UserPermissionsModal } from "@/components/dashboard/user-permissions-modal";
import { UserCreateEditCard } from "@/components/dashboard/user-create-edit-card";
import { UserListCard } from "@/components/dashboard/user-list-card";
import { ManageManagerModal } from "@/components/dashboard/manage-manager-modal";

function getUserFullName(user: UserItem) {
    return `${user.firstName} ${user.lastName}`.trim();
}

function getCurrentManagerName(user: UserItem, managers: UserItem[]) {
    const linkedManager = managers.find((manager) => manager.id === user.managerId);
    
    if (linkedManager) {
        return getUserFullName(linkedManager);
    }

    const nestedManager = user.manager;
    if (nestedManager && typeof nestedManager === "object") {
        const managerRecord = nestedManager as Record<string, unknown>;
        const firstName = managerRecord.firstName;
        const lastName = managerRecord.lastName;
        if (typeof firstName === "string" || typeof lastName === "string") {
            return `${typeof firstName === "string" ? firstName : ""} ${typeof lastName === "string" ? lastName : ""}`.trim();
        }
    }

    return null;
}

export default function UsersPage() {
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [permissionUser, setPermissionUser] = useState<UserItem | null>(null);
    const [managerUser, setManagerUser] = useState<UserItem | null>(null);
    const [selectedManagerId, setSelectedManagerId] = useState<string>("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
    const [initialPermissionIds, setInitialPermissionIds] = useState<string[]>([]);

    const meQuery = useQuery({
        queryKey: ["auth", "me"],
        queryFn: authApi.me,
    });

    const usersQuery = useQuery({
        queryKey: ["users", "list"],
        queryFn: usersApi.findAll,
    });

    const permissionsQuery = useQuery({
        queryKey: ["permissions", "list", "for-user-modal"],
        queryFn: permissionsApi.findAll,
        enabled: Boolean(permissionUser),
    });

    const userPermissionsQuery = useQuery({
        queryKey: ["user-permissions", permissionUser?.id],
        queryFn: async () => {
            if (!permissionUser) {
                return null;
            }

            return userPermissionsApi.getByUser(permissionUser.id);
        },
        enabled: Boolean(permissionUser),
    });

    const createMutation = useMutation({
        mutationFn: usersApi.create,
        onSuccess: (response) => {
            toast.success(response.message || "User created successfully");
            queryClient.invalidateQueries({ queryKey: ["users", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => usersApi.update(id, payload),
        onSuccess: (response) => {
            toast.success(response.message || "User updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users", "list"] });
            setEditingUser(null);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const updateManagerMutation = useMutation({
        mutationFn: ({ userId, managerId }: { userId: string; managerId: string }) =>
            usersApi.update(userId, { managerId }),
        onSuccess: (response) => {
            toast.success(response.message || "Manager updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users", "list"] });
            setManagerUser(null);
            setSelectedManagerId("");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const suspendMutation = useMutation({
        mutationFn: usersApi.suspend,
        onSuccess: (response) => {
            toast.success(response.message || "User suspended successfully");
            queryClient.invalidateQueries({ queryKey: ["users", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const banMutation = useMutation({
        mutationFn: usersApi.ban,
        onSuccess: (response) => {
            toast.success(response.message || "User banned successfully");
            queryClient.invalidateQueries({ queryKey: ["users", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const activateMutation = useMutation({
        mutationFn: usersApi.activate,
        onSuccess: (response) => {
            toast.success(response.message || "User activated successfully");
            queryClient.invalidateQueries({ queryKey: ["users", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const isStatusMutationPending =
        suspendMutation.isPending || banMutation.isPending || activateMutation.isPending;

    const setUserPermissionsMutation = useMutation({
        mutationFn: ({ userId, permissionIds }: { userId: string; permissionIds: string[]; permissions?: string[] }) =>
            userPermissionsApi.setForUser(userId, { permissionIds }),
        onSuccess: (response) => {
            toast.success(response.message || "User permissions updated successfully");
            queryClient.invalidateQueries({ queryKey: ["user-permissions", permissionUser?.id] });
            setPermissionUser(null);
            setSelectedPermissionIds([]);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);
    const isAdmin = useMemo(() => {
        const role = meQuery.data?.data?.role;
        return typeof role === "string" && role.toLowerCase() === "admin";
    }, [meQuery.data?.data?.role]);
    const managers = useMemo(
        () => users.filter((user) => extractRoleName(user.role).toLowerCase() === "manager"),
        [users],
    );
    const currentManagerName = useMemo(() => {
        if (!managerUser) {
            return null;
        }

        return getCurrentManagerName(managerUser, managers);
    }, [managerUser, managers]);

    const availablePermissions = useMemo(() => permissionsQuery.data?.data ?? [], [permissionsQuery.data?.data]);
    const availablePermissionIdSet = useMemo(
        () => new Set(availablePermissions.map((permission) => permission.id)),
        [availablePermissions],
    );

    useEffect(() => {
        if (!permissionUser) {
            return;
        }

        const permissionRefs = extractPermissionRefs(userPermissionsQuery.data?.data);
        const refsSet = new Set(permissionRefs);

        const resolvedIds = availablePermissions
            .filter((permission) => refsSet.has(permission.id) || refsSet.has(permission.key))
            .map((permission) => permission.id);

        setSelectedPermissionIds(resolvedIds);
        setInitialPermissionIds(resolvedIds);
    }, [availablePermissions, permissionUser, userPermissionsQuery.data?.data]);

    const handleCreate = (values: UserFormValues) => {
        createMutation.mutate(toCreatePayload(values));
    };

    const handleUpdate = (values: UserFormValues) => {
        if (!editingUser) {
            return;
        }

        updateMutation.mutate({
            id: editingUser.id,
            payload: toUpdatePayload(values),
        });
    };

    const handleStatusAction = (action: "suspend" | "ban" | "activate", user: UserItem) => {
        const confirmed = window.confirm(`Are you sure you want to ${action} ${user.email}?`);

        if (!confirmed) {
            return;
        }

        if (action === "suspend") {
            suspendMutation.mutate(user.id);
            return;
        }

        if (action === "ban") {
            banMutation.mutate(user.id);
            return;
        }

        activateMutation.mutate(user.id);
    };

    const openPermissionModal = (user: UserItem) => {
        setPermissionUser(user);
        setSelectedPermissionIds([]);
        setInitialPermissionIds([]);
    };

    const openManageManagerModal = (user: UserItem) => {
        setManagerUser(user);
        setSelectedManagerId(typeof user.managerId === "string" ? user.managerId : "");
    };

    const togglePermission = (permissionId: string, checked: boolean) => {
        setSelectedPermissionIds((previous) => {
            if (checked) {
                return Array.from(new Set([...previous, permissionId]));
            }

            return previous.filter((id) => id !== permissionId);
        });
    };

    const handleSaveUserPermissions = () => {
        if (!permissionUser) {
            return;
        }

        const sanitizedPermissionIds = Array.from(
            new Set(selectedPermissionIds.filter((id) => availablePermissionIdSet.has(id))),
        );

        if (sanitizedPermissionIds.length === 0 && initialPermissionIds.length === 0) {
            setPermissionUser(null);
            return;
        }

        if (sanitizedPermissionIds.length === 0 && initialPermissionIds.length > 0) {
            userPermissionsApi.removeManyPermissions(permissionUser.id, initialPermissionIds)
                .then(() => {
                    toast.success("User permissions updated successfully");
                    queryClient.invalidateQueries({ queryKey: ["user-permissions", permissionUser.id] });
                    setPermissionUser(null);
                    setSelectedPermissionIds([]);
                    setInitialPermissionIds([]);
                })
                .catch((error: unknown) => {
                    toast.error(getApiErrorMessage(error));
                });
            return;
        }

        setUserPermissionsMutation.mutate({
            userId: permissionUser.id,
            permissionIds: sanitizedPermissionIds,
            permissions: sanitizedPermissionIds,
        });
    };

    const handleSaveManager = () => {
        if (!managerUser || !selectedManagerId) {
            return;
        }

        updateManagerMutation.mutate({
            userId: managerUser.id,
            managerId: selectedManagerId,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Users</h1>
                <p className="text-sm text-muted-foreground">Manage users in your allowed scope.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <UserListCard
                    users={users}
                    isAdmin={isAdmin}
                    isLoading={usersQuery.isLoading}
                    isError={usersQuery.isError}
                    isStatusMutationPending={isStatusMutationPending}
                    onEdit={setEditingUser}
                    onOpenPermissions={openPermissionModal}
                    onManageManager={openManageManagerModal}
                    onStatusAction={handleStatusAction}
                />

                <UserCreateEditCard
                    editingUser={editingUser}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onCancelEdit={() => setEditingUser(null)}
                    isCreateSubmitting={createMutation.isPending}
                    isUpdateSubmitting={updateMutation.isPending}
                />
            </div>

            <UserPermissionsModal
                user={permissionUser}
                availablePermissions={availablePermissions}
                selectedPermissionIds={selectedPermissionIds}
                isLoading={permissionsQuery.isLoading || userPermissionsQuery.isLoading}
                isError={permissionsQuery.isError || userPermissionsQuery.isError}
                isSaving={setUserPermissionsMutation.isPending}
                onClose={() => {
                    setPermissionUser(null);
                    setSelectedPermissionIds([]);
                    setInitialPermissionIds([]);
                }}
                onTogglePermission={togglePermission}
                onSave={handleSaveUserPermissions}
            />

            <ManageManagerModal
                user={managerUser}
                managers={managers}
                selectedManagerId={selectedManagerId}
                currentManagerName={currentManagerName}
                isSaving={updateManagerMutation.isPending}
                onClose={() => {
                    setManagerUser(null);
                    setSelectedManagerId("");
                }}
                onSelectManager={setSelectedManagerId}
                onSave={handleSaveManager}
            />
        </div>
    );
}
