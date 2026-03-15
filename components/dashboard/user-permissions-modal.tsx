"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PermissionItem } from "@/lib/api/features/permissions";
import type { UserItem } from "@/lib/api/features/users";

type UserPermissionsModalProps = {
    user: UserItem | null;
    availablePermissions: PermissionItem[];
    selectedPermissionIds: string[];
    isLoading: boolean;
    isError: boolean;
    isSaving: boolean;
    onClose: () => void;
    onTogglePermission: (permissionId: string, checked: boolean) => void;
    onSave: () => void;
};

export function UserPermissionsModal({
    user,
    availablePermissions,
    selectedPermissionIds,
    isLoading,
    isError,
    isSaving,
    onClose,
    onTogglePermission,
    onSave,
}: UserPermissionsModalProps) {
    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-label="Close permissions modal overlay"
            />

            <Card className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <CardTitle>Grant User Permissions</CardTitle>
                            <CardDescription>
                                {user.firstName} {user.lastName} ({user.email})
                            </CardDescription>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-auto"
                            onClick={onClose}
                            aria-label="Close permissions modal"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="max-h-[60vh] space-y-4 overflow-y-auto">
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading permissions...</p>
                    ) : isError ? (
                        <p className="text-sm text-destructive">Failed to load permissions data.</p>
                    ) : availablePermissions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No permissions available.</p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {availablePermissions.map((permission) => {
                                const checked = selectedPermissionIds.includes(permission.id);

                                return (
                                    <Label
                                        key={permission.id}
                                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3"
                                    >
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={(value) => onTogglePermission(permission.id, Boolean(value))}
                                        />
                                        <span className="space-y-1">
                                            <span className="block text-sm font-medium text-foreground">
                                                {permission.key}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                Module: {permission.module}
                                            </span>
                                        </span>
                                    </Label>
                                );
                            })}
                        </div>
                    )}
                </CardContent>

                <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={onSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Permissions"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
