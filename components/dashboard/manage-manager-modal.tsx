"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserItem } from "@/lib/api/features/users";

type ManageManagerModalProps = {
    user: UserItem | null;
    managers: UserItem[];
    selectedManagerId: string;
    currentManagerName: string | null;
    isSaving: boolean;
    onClose: () => void;
    onSelectManager: (managerId: string) => void;
    onSave: () => void;
};

function getFullName(user: UserItem) {
    return `${user.firstName} ${user.lastName}`.trim();
}

export function ManageManagerModal({
    user,
    managers,
    selectedManagerId,
    currentManagerName,
    isSaving,
    onClose,
    onSelectManager,
    onSave,
}: ManageManagerModalProps) {
    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-label="Close manage manager modal overlay"
            />

            <Card className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <CardTitle>Manage Manager</CardTitle>
                            <CardDescription>
                                {user.firstName} {user.lastName} ({user.email})
                            </CardDescription>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-auto"
                            onClick={onClose}
                            aria-label="Close manage manager modal"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="max-h-[60vh] space-y-4 overflow-y-auto">
                    <div className="rounded-lg border border-border p-3 text-sm">
                        <span className="text-muted-foreground">Current manager: </span>
                        <span className="font-medium text-foreground">{currentManagerName ?? "Not set"}</span>
                    </div>

                    {managers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No managers available.</p>
                    ) : (
                        <div className="grid gap-2">
                            {managers.map((manager) => {
                                const isSelected = selectedManagerId === manager.id;
                                return (
                                    <button
                                        key={manager.id}
                                        type="button"
                                        onClick={() => onSelectManager(manager.id)}
                                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                            isSelected
                                                ? "border-primary bg-muted"
                                                : "border-border hover:bg-muted/40"
                                        }`}
                                    >
                                        <p className="text-sm font-medium text-foreground">{getFullName(manager)}</p>
                                        <p className="text-xs text-muted-foreground">{manager.email}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </CardContent>

                <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={onSave}
                        disabled={isSaving || managers.length === 0 || !selectedManagerId}
                    >
                        {isSaving ? "Saving..." : "Update Manager"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}