import { Ban, CheckCircle2, PauseCircle, Pencil, ShieldCheck } from "lucide-react";

import { extractRoleName } from "@/lib/users/helpers";
import { type UserItem } from "@/lib/api/features/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserListCardProps = {
    users: UserItem[];
    isLoading: boolean;
    isError: boolean;
    isStatusMutationPending: boolean;
    onEdit: (user: UserItem) => void;
    onOpenPermissions: (user: UserItem) => void;
    onStatusAction: (action: "suspend" | "ban" | "activate", user: UserItem) => void;
};

export function UserListCard({
    users,
    isLoading,
    isError,
    isStatusMutationPending,
    onEdit,
    onOpenPermissions,
    onStatusAction,
}: UserListCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>View and manage users based on your role scope.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                ) : isError ? (
                    <p className="text-sm text-destructive">Failed to load users.</p>
                ) : users.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users found.</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        <span>Role: {extractRoleName(user.role)}</span>
                                        <span>Status: {user.status ?? "active"}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-auto"
                                        onClick={() => onEdit(user)}
                                    >
                                        <Pencil className="mr-1 size-3.5" /> Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-auto"
                                        onClick={() => onOpenPermissions(user)}
                                    >
                                        <ShieldCheck className="mr-1 size-3.5" /> Permissions
                                    </Button>

                                    {(user.status ?? "active") !== "suspended" && (user.status ?? "active") !== "banned" ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-auto"
                                            onClick={() => onStatusAction("suspend", user)}
                                            disabled={isStatusMutationPending}
                                        >
                                            <PauseCircle className="mr-1 size-3.5" /> Suspend
                                        </Button>
                                    ) : null}

                                    {(user.status ?? "active") !== "banned" ? (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="w-auto"
                                            onClick={() => onStatusAction("ban", user)}
                                            disabled={isStatusMutationPending}
                                        >
                                            <Ban className="mr-1 size-3.5" /> Ban
                                        </Button>
                                    ) : null}

                                    {(user.status ?? "active") !== "active" ? (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-auto"
                                            onClick={() => onStatusAction("activate", user)}
                                            disabled={isStatusMutationPending}
                                        >
                                            <CheckCircle2 className="mr-1 size-3.5" /> Activate
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}