"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/forms/form";
import { FormInputGroup } from "@/components/forms/form-input-group";
import { FormSelectGroup } from "@/components/forms/form-select-group";
import { Button } from "@/components/ui/button";
import type { TaskStatus } from "@/lib/api/features/tasks";

export type TaskFormValues = {
    title: string;
    description: string;
    assignedToId: string;
    status: TaskStatus;
    dueDate: string;
};

type TaskFormProps = {
    mode: "create" | "edit";
    initialValues?: Partial<TaskFormValues>;
    assigneeOptions: Array<{ value: string; label: string }>;
    isSubmitting?: boolean;
    onSubmit: (values: TaskFormValues) => void;
    onCancel?: () => void;
};

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

export function TaskForm({
    mode,
    initialValues,
    assigneeOptions,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: TaskFormProps) {
    const form = useForm<TaskFormValues>({
        defaultValues: {
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            assignedToId: initialValues?.assignedToId ?? "__unassigned__",
            status: (initialValues?.status as TaskStatus | undefined) ?? "pending",
            dueDate: initialValues?.dueDate ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            assignedToId: initialValues?.assignedToId ?? "__unassigned__",
            status: (initialValues?.status as TaskStatus | undefined) ?? "pending",
            dueDate: initialValues?.dueDate ?? "",
        });
    }, [
        form,
        initialValues?.assignedToId,
        initialValues?.description,
        initialValues?.dueDate,
        initialValues?.status,
        initialValues?.title,
    ]);

    const assigneeSelectOptions = [{ value: "__unassigned__", label: "Unassigned" }, ...assigneeOptions];

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <FormInputGroup
                label="Title"
                name="title"
                placeholder="Follow up with customer"
                rules={{ required: "Title is required" }}
            />

            <FormInputGroup
                label="Description"
                name="description"
                placeholder="Optional description"
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <FormSelectGroup
                    label="Assign To"
                    name="assignedToId"
                    options={assigneeSelectOptions}
                    placeholder="Select assignee"
                />

                <FormSelectGroup
                    label="Status"
                    name="status"
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                    rules={{ required: "Status is required" }}
                />
            </div>

            <FormInputGroup
                label="Due Date"
                name="dueDate"
                type="datetime-local"
                placeholder="Select due date"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {onCancel ? (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                ) : null}

                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting
                        ? mode === "create"
                            ? "Creating..."
                            : "Updating..."
                        : mode === "create"
                            ? "Create Task"
                            : "Update Task"}
                </Button>
            </div>
        </Form>
    );
}