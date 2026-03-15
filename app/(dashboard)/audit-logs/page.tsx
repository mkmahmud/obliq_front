"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, X } from "lucide-react";

import { auditLogsApi, type AuditLogItem } from "@/lib/api/features/audit-logs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

const DEFAULT_PAGE_SIZE = 5;

function formatDateTime(value?: string) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

function getActorDisplay(log: AuditLogItem) {
    const actor = log.actor;
    if (actor && typeof actor === "object") {
        const firstName = typeof actor.firstName === "string" ? actor.firstName : "";
        const lastName = typeof actor.lastName === "string" ? actor.lastName : "";
        const fullName = `${firstName} ${lastName}`.trim();
        const email = typeof actor.email === "string" ? actor.email : "";

        if (fullName && email) {
            return `${fullName} (${email})`;
        }

        if (fullName) {
            return fullName;
        }

        if (email) {
            return email;
        }
    }

    return log.actorId ?? "System";
}

function parseAuditLogsPayload(payload: unknown, fallbackPage: number, fallbackLimit: number) {
    if (Array.isArray(payload)) {
        return {
            items: payload as AuditLogItem[],
            page: fallbackPage,
            limit: fallbackLimit,
            totalItems: payload.length,
            totalPages: 1,
        };
    }

    if (!payload || typeof payload !== "object") {
        return {
            items: [] as AuditLogItem[],
            page: fallbackPage,
            limit: fallbackLimit,
            totalItems: 0,
            totalPages: 1,
        };
    }

    const record = payload as Record<string, unknown>;
    const meta = (record.meta && typeof record.meta === "object" ? record.meta : null) as Record<string, unknown> | null;
    const pagination =
        (record.pagination && typeof record.pagination === "object"
            ? record.pagination
            : null) as Record<string, unknown> | null;

    const parseNumber = (value: unknown) => {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === "string") {
            const parsedNumber = Number(value);
            return Number.isFinite(parsedNumber) ? parsedNumber : null;
        }

        return null;
    };

    const items =
        (Array.isArray(record.items) ? record.items : null) ??
        (Array.isArray(record.data) ? record.data : null) ??
        (Array.isArray(record.records) ? record.records : null) ??
        (Array.isArray(meta?.items) ? meta.items : null) ??
        (Array.isArray(pagination?.items) ? pagination.items : null) ??
        [];

    const page =
        parseNumber(record.page) ??
        parseNumber(meta?.page) ??
        parseNumber(meta?.currentPage) ??
        parseNumber(pagination?.page) ??
        parseNumber(pagination?.currentPage) ??
        fallbackPage;

    const limit =
        parseNumber(record.limit) ??
        parseNumber(meta?.limit) ??
        parseNumber(meta?.pageSize) ??
        parseNumber(pagination?.limit) ??
        parseNumber(pagination?.pageSize) ??
        fallbackLimit;

    const totalItems =
        parseNumber(record.total) ??
        parseNumber(record.totalItems) ??
        parseNumber(record.totalCount) ??
        parseNumber(meta?.total) ??
        parseNumber(meta?.totalItems) ??
        parseNumber(meta?.count) ??
        parseNumber(pagination?.total) ??
        parseNumber(pagination?.totalItems) ??
        parseNumber(pagination?.count) ??
        items.length;

    const totalPages =
        parseNumber(record.totalPages) ??
        parseNumber(meta?.totalPages) ??
        parseNumber(meta?.pages) ??
        parseNumber(pagination?.totalPages) ??
        parseNumber(pagination?.pages) ??
        Math.max(1, Math.ceil(totalItems / Math.max(1, limit)));

    return {
        items: items as AuditLogItem[],
        page,
        limit,
        totalItems,
        totalPages,
    };
}

export default function AuditLogsPage() {
    const [page, setPage] = useState(1);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    const listQuery = useQuery({
        queryKey: ["audit-logs", "list", page, DEFAULT_PAGE_SIZE],
        queryFn: () => auditLogsApi.findAll(page, DEFAULT_PAGE_SIZE),
    });

    const selectedLogQuery = useQuery({
        queryKey: ["audit-logs", "detail", selectedLogId],
        queryFn: async () => {
            if (!selectedLogId) {
                return null;
            }

            return auditLogsApi.findOne(selectedLogId);
        },
        enabled: Boolean(selectedLogId),
    });

    const parsed = useMemo(
        () => parseAuditLogsPayload(listQuery.data?.data, page, DEFAULT_PAGE_SIZE),
        [listQuery.data?.data, page],
    );

    const logs = parsed.items;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Audit Logs</h1>
                <p className="text-sm text-muted-foreground">View platform activity and security-sensitive actions.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Logs</CardTitle>
                    <CardDescription>Admin-only logs from the audit trail.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {listQuery.isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading audit logs...</p>
                    ) : listQuery.isError ? (
                        <p className="text-sm text-destructive">Failed to load audit logs.</p>
                    ) : logs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No audit logs found.</p>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-foreground">{log.action}</p>
                                        <p className="text-xs text-muted-foreground">Actor: {getActorDisplay(log)}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span>Target Type: {log.targetType ?? "-"}</span>
                                            <span>Target ID: {log.targetId ?? "-"}</span>
                                            <span>IP: {log.ipAddress ?? "-"}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            At: {formatDateTime(log.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-auto"
                                            onClick={() => setSelectedLogId(log.id)}
                                        >
                                            <Eye className="mr-1 size-3.5" /> View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <PaginationControls
                        page={parsed.page}
                        pageSize={parsed.limit}
                        totalItems={parsed.totalItems}
                        totalPages={parsed.totalPages}
                        onPageChange={setPage}
                        isLoading={listQuery.isLoading || listQuery.isFetching}
                    />
                </CardContent>
            </Card>

            {selectedLogId ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSelectedLogId(null)}
                        aria-label="Close audit log details overlay"
                    />

                    <Card className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden">
                        <CardHeader className="border-b border-border pb-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <CardTitle>Audit Log Details</CardTitle>
                                    <CardDescription>{selectedLogId}</CardDescription>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-auto"
                                    onClick={() => setSelectedLogId(null)}
                                    aria-label="Close audit log details"
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="max-h-[65vh] space-y-4 overflow-y-auto">
                            {selectedLogQuery.isLoading ? (
                                <p className="text-sm text-muted-foreground">Loading details...</p>
                            ) : selectedLogQuery.isError ? (
                                <p className="text-sm text-destructive">Failed to load log details.</p>
                            ) : !selectedLogQuery.data?.data ? (
                                <p className="text-sm text-muted-foreground">No details found.</p>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">Action</p>
                                            <p className="font-medium text-foreground">{selectedLogQuery.data.data.action}</p>
                                        </div>
                                        <div className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">Actor</p>
                                            <p className="font-medium text-foreground">{getActorDisplay(selectedLogQuery.data.data)}</p>
                                        </div>
                                        <div className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">Target Type</p>
                                            <p className="font-medium text-foreground">{selectedLogQuery.data.data.targetType ?? "-"}</p>
                                        </div>
                                        <div className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">Target ID</p>
                                            <p className="font-medium text-foreground">{selectedLogQuery.data.data.targetId ?? "-"}</p>
                                        </div>
                                        <div className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">IP Address</p>
                                            <p className="font-medium text-foreground">{selectedLogQuery.data.data.ipAddress ?? "-"}</p>
                                        </div>
                                        <div className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">Created At</p>
                                            <p className="font-medium text-foreground">
                                                {formatDateTime(selectedLogQuery.data.data.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-border p-3 text-sm">
                                        <p className="mb-2 text-xs text-muted-foreground">Meta</p>
                                        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                                            {JSON.stringify(selectedLogQuery.data.data.meta ?? {}, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : null}
        </div>
    );
}
