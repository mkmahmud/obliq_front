"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    reportsApi,
    type CreateReportPayload,
    type ReportItem,
    type UpdateReportPayload,
} from "@/lib/api/features/reports";
import { ReportForm, type ReportFormValues } from "@/components/forms/reports/report-form";
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

function formatDateTime(value?: string | null) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

function toReportUserName(report: ReportItem) {
    const user = report.createdBy;
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

function toReportPayload(values: ReportFormValues): CreateReportPayload {
    return {
        title: values.title.trim(),
        type: values.type.trim(),
        data: values.dataJson.trim() ? JSON.parse(values.dataJson) : undefined,
    };
}

export default function ReportsPage() {
    const queryClient = useQueryClient();
    const [editingReport, setEditingReport] = useState<ReportItem | null>(null);

    const reportsQuery = useQuery({
        queryKey: ["reports", "list"],
        queryFn: reportsApi.findAll,
    });

    const createMutation = useMutation({
        mutationFn: reportsApi.create,
        onSuccess: (response) => {
            toast.success(response.message || "Report created successfully");
            queryClient.invalidateQueries({ queryKey: ["reports", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateReportPayload }) => reportsApi.update(id, payload),
        onSuccess: (response) => {
            toast.success(response.message || "Report updated successfully");
            queryClient.invalidateQueries({ queryKey: ["reports", "list"] });
            setEditingReport(null);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: reportsApi.remove,
        onSuccess: (response, deletedId) => {
            toast.success(response.message || "Report deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["reports", "list"] });
            if (editingReport?.id === deletedId) {
                setEditingReport(null);
            }
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const reports = useMemo(() => reportsQuery.data?.data ?? [], [reportsQuery.data?.data]);

    const handleCreate = (values: ReportFormValues) => {
        createMutation.mutate(toReportPayload(values));
    };

    const handleUpdate = (values: ReportFormValues) => {
        if (!editingReport) {
            return;
        }

        updateMutation.mutate({
            id: editingReport.id,
            payload: toReportPayload(values),
        });
    };

    const handleDelete = (report: ReportItem) => {
        const confirmed = window.confirm(`Delete report "${report.title}"?`);

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(report.id);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
                <p className="text-sm text-muted-foreground">Generate and review reports in your scope.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Report List</CardTitle>
                        <CardDescription>View and manage reports in your scope.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {reportsQuery.isLoading ? (
                            <p className="text-sm text-muted-foreground">Loading reports...</p>
                        ) : reportsQuery.isError ? (
                            <p className="text-sm text-destructive">Failed to load reports.</p>
                        ) : reports.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No reports found.</p>
                        ) : (
                            reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{report.title}</p>
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span>Type: {report.type}</span>
                                                <span>Created At: {formatDateTime(report.createdAt)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Created By: {toReportUserName(report)}
                                            </p>
                                            <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                                                {JSON.stringify(report.data ?? {}, null, 2)}
                                            </pre>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-auto"
                                                onClick={() => setEditingReport(report)}
                                            >
                                                <Pencil className="mr-1 size-3.5" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="w-auto"
                                                onClick={() => handleDelete(report)}
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
                        <CardTitle>{editingReport ? "Edit Report" : "Create Report"}</CardTitle>
                        <CardDescription>
                            {editingReport ? "Update selected report details." : "Create a new report in your scope."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editingReport ? (
                            <ReportForm
                                mode="edit"
                                initialValues={{
                                    title: editingReport.title,
                                    type: editingReport.type,
                                    dataJson: editingReport.data ? JSON.stringify(editingReport.data, null, 2) : "",
                                }}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingReport(null)}
                                isSubmitting={updateMutation.isPending}
                            />
                        ) : (
                            <ReportForm
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
