"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    leadsApi,
    type CreateLeadPayload,
    type LeadItem,
    type UpdateLeadPayload,
} from "@/lib/api/features/leads";
import { usersApi } from "@/lib/api/features/users";
import { LeadForm, type LeadFormValues } from "@/components/forms/leads/lead-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

function toLeadPayload(values: LeadFormValues): CreateLeadPayload {
    return {
        name: values.name.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        assignedToId: values.assignedToId === "__unassigned__" ? undefined : values.assignedToId,
        status: values.status.trim() || undefined,
    };
}

function toLeadUserName(lead: LeadItem, field: "assignedTo" | "createdBy") {
    const user = lead[field];
    if (!user || typeof user !== "object") {
        return "-";
    }

    const firstName = typeof user.firstName === "string" ? user.firstName : "";
    const lastName = typeof user.lastName === "string" ? user.lastName : "";
    const fullName = `${firstName} ${lastName}`.trim();
    const email = typeof user.email === "string" ? user.email : "";

    if (fullName && email) {
        return `${fullName} (${email})`;
    }

    return fullName || email || "-";
}

export default function LeadsPage() {
    const queryClient = useQueryClient();
    const [editingLead, setEditingLead] = useState<LeadItem | null>(null);

    const leadsQuery = useQuery({
        queryKey: ["leads", "list"],
        queryFn: leadsApi.findAll,
    });

    const usersQuery = useQuery({
        queryKey: ["users", "list", "for-lead-assignee"],
        queryFn: usersApi.findAll,
    });

    const createMutation = useMutation({
        mutationFn: leadsApi.create,
        onSuccess: (response) => {
            toast.success(response.message || "Lead created successfully");
            queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) => leadsApi.update(id, payload),
        onSuccess: (response) => {
            toast.success(response.message || "Lead updated successfully");
            queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
            setEditingLead(null);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: leadsApi.remove,
        onSuccess: (response, deletedId) => {
            toast.success(response.message || "Lead deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
            if (editingLead?.id === deletedId) {
                setEditingLead(null);
            }
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const leads = useMemo(() => leadsQuery.data?.data ?? [], [leadsQuery.data?.data]);
    const assigneeOptions = useMemo(
        () =>
            (usersQuery.data?.data ?? []).map((user) => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName}`.trim() || user.email,
            })),
        [usersQuery.data?.data],
    );

    const handleCreate = (values: LeadFormValues) => {
        createMutation.mutate(toLeadPayload(values));
    };

    const handleUpdate = (values: LeadFormValues) => {
        if (!editingLead) {
            return;
        }

        updateMutation.mutate({
            id: editingLead.id,
            payload: toLeadPayload(values),
        });
    };

    const handleDelete = (lead: LeadItem) => {
        const confirmed = window.confirm(`Delete lead "${lead.name}"?`);

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(lead.id);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
                <p className="text-sm text-muted-foreground">Track and manage lead records in your scope.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Lead List</CardTitle>
                        <CardDescription>View and manage all leads in your scope.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {leadsQuery.isLoading ? (
                            <p className="text-sm text-muted-foreground">Loading leads...</p>
                        ) : leadsQuery.isError ? (
                            <p className="text-sm text-destructive">Failed to load leads.</p>
                        ) : leads.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No leads found.</p>
                        ) : (
                            leads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span>Email: {lead.email ?? "-"}</span>
                                                <span>Phone: {lead.phone ?? "-"}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span>Status: {lead.status ?? "-"}</span>
                                                <span>Assigned To: {toLeadUserName(lead, "assignedTo")}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Created By: {toLeadUserName(lead, "createdBy")}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-auto"
                                                onClick={() => setEditingLead(lead)}
                                            >
                                                <Pencil className="mr-1 size-3.5" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="w-auto"
                                                onClick={() => handleDelete(lead)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="mr-1 size-3.5" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{editingLead ? "Edit Lead" : "Create Lead"}</CardTitle>
                        <CardDescription>
                            {editingLead ? "Update selected lead details." : "Create a new lead in your scope."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editingLead ? (
                            <LeadForm
                                mode="edit"
                                initialValues={{
                                    name: editingLead.name,
                                    email: editingLead.email ?? "",
                                    phone: editingLead.phone ?? "",
                                    assignedToId: editingLead.assignedToId ?? "__unassigned__",
                                    status: editingLead.status ?? "new",
                                }}
                                assigneeOptions={assigneeOptions}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingLead(null)}
                                isSubmitting={updateMutation.isPending}
                            />
                        ) : (
                            <LeadForm
                                mode="create"
                                assigneeOptions={assigneeOptions}
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
