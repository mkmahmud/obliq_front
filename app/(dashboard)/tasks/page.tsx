"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    tasksApi,
    type CreateTaskPayload,
    type TaskItem,
    type UpdateTaskPayload,
} from "@/lib/api/features/tasks";
import { usersApi } from "@/lib/api/features/users";
import { TaskForm, type TaskFormValues } from "@/components/forms/tasks/task-form";
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

function toDateTimeLocalValue(value?: string | null) {
    if (!value) {
        return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const timezoneOffset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function toTaskPayload(values: TaskFormValues): CreateTaskPayload {
    const assignedToId = values.assignedToId === "__unassigned__" ? undefined : values.assignedToId;
    const dueDate = values.dueDate.trim() ? new Date(values.dueDate).toISOString() : undefined;

    return {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        assignedToId,
        status: values.status,
        dueDate,
    };
}

function toTaskUserName(task: TaskItem, field: "assignedTo" | "createdBy") {
    const user = task[field];
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

function formatStatus(status: string) {
    return status
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default function TasksPage() {
    const queryClient = useQueryClient();
    const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
    const [activeTab, setActiveTab] = useState<"all" | "assigned-to-me">("all");

    const tasksQuery = useQuery({
        queryKey: ["tasks", "list", activeTab],
        queryFn: () => (activeTab === "assigned-to-me" ? tasksApi.findAssignedToMe() : tasksApi.findAll()),
    });

    const usersQuery = useQuery({
        queryKey: ["users", "list", "for-task-assignee"],
        queryFn: usersApi.findAll,
    });

    const createMutation = useMutation({
        mutationFn: tasksApi.create,
        onSuccess: (response) => {
            toast.success(response.message || "Task created successfully");
            queryClient.invalidateQueries({ queryKey: ["tasks", "list"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => tasksApi.update(id, payload),
        onSuccess: (response) => {
            toast.success(response.message || "Task updated successfully");
            queryClient.invalidateQueries({ queryKey: ["tasks", "list"] });
            setEditingTask(null);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: tasksApi.remove,
        onSuccess: (response, deletedId) => {
            toast.success(response.message || "Task deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["tasks", "list"] });
            if (editingTask?.id === deletedId) {
                setEditingTask(null);
            }
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const tasks = useMemo(() => tasksQuery.data?.data ?? [], [tasksQuery.data?.data]);
    const assigneeOptions = useMemo(
        () =>
            (usersQuery.data?.data ?? []).map((user) => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName}`.trim() || user.email,
            })),
        [usersQuery.data?.data],
    );

    const handleCreate = (values: TaskFormValues) => {
        createMutation.mutate(toTaskPayload(values));
    };

    const handleUpdate = (values: TaskFormValues) => {
        if (!editingTask) {
            return;
        }

        updateMutation.mutate({
            id: editingTask.id,
            payload: toTaskPayload(values),
        });
    };

    const handleDelete = (task: TaskItem) => {
        const confirmed = window.confirm(`Delete task "${task.title}"?`);

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(task.id);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
                <p className="text-sm text-muted-foreground">Manage tasks in your allowed scope.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant={activeTab === "all" ? "default" : "outline"}
                    className="w-auto"
                    onClick={() => setActiveTab("all")}
                >
                    All Tasks
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={activeTab === "assigned-to-me" ? "default" : "outline"}
                    className="w-auto"
                    onClick={() => setActiveTab("assigned-to-me")}
                >
                    Assigned To Me
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <Card>
                    <CardHeader>
                        <CardTitle>{activeTab === "all" ? "Task List" : "Assigned To Me"}</CardTitle>
                        <CardDescription>
                            {activeTab === "all"
                                ? "View and manage all tasks in your scope."
                                : "View tasks that are assigned to your account."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tasksQuery.isLoading ? (
                            <p className="text-sm text-muted-foreground">Loading tasks...</p>
                        ) : tasksQuery.isError ? (
                            <p className="text-sm text-destructive">Failed to load tasks.</p>
                        ) : tasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No tasks found.</p>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{task.title}</p>
                                            {task.description ? (
                                                <p className="text-xs text-muted-foreground">{task.description}</p>
                                            ) : null}
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span>Status: {formatStatus(task.status)}</span>
                                                <span>Assigned To: {toTaskUserName(task, "assignedTo")}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span>Created By: {toTaskUserName(task, "createdBy")}</span>
                                                <span>Due: {formatDateTime(task.dueDate)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-auto"
                                                onClick={() => setEditingTask(task)}
                                            >
                                                <Pencil className="mr-1 size-3.5" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="w-auto"
                                                onClick={() => handleDelete(task)}
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
                        <CardTitle>{editingTask ? "Edit Task" : "Create Task"}</CardTitle>
                        <CardDescription>
                            {editingTask ? "Update selected task details." : "Create a new task in your scope."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editingTask ? (
                            <TaskForm
                                mode="edit"
                                initialValues={{
                                    title: editingTask.title,
                                    description: editingTask.description ?? "",
                                    assignedToId: editingTask.assignedToId ?? "__unassigned__",
                                    status: editingTask.status,
                                    dueDate: toDateTimeLocalValue(editingTask.dueDate),
                                }}
                                assigneeOptions={assigneeOptions}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingTask(null)}
                                isSubmitting={updateMutation.isPending}
                            />
                        ) : (
                            <TaskForm
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
