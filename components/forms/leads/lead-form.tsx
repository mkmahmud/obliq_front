"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/forms/form";
import { FormInputGroup } from "@/components/forms/form-input-group";
import { FormSelectGroup } from "@/components/forms/form-select-group";
import { Button } from "@/components/ui/button";

export type LeadFormValues = {
    name: string;
    email: string;
    phone: string;
    assignedToId: string;
    status: string;
};

type LeadFormProps = {
    mode: "create" | "edit";
    initialValues?: Partial<LeadFormValues>;
    assigneeOptions: Array<{ value: string; label: string }>;
    isSubmitting?: boolean;
    onSubmit: (values: LeadFormValues) => void;
    onCancel?: () => void;
};

const STATUS_OPTIONS = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
];

export function LeadForm({
    mode,
    initialValues,
    assigneeOptions,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: LeadFormProps) {
    const form = useForm<LeadFormValues>({
        defaultValues: {
            name: initialValues?.name ?? "",
            email: initialValues?.email ?? "",
            phone: initialValues?.phone ?? "",
            assignedToId: initialValues?.assignedToId ?? "__unassigned__",
            status: initialValues?.status ?? "new",
        },
    });

    useEffect(() => {
        form.reset({
            name: initialValues?.name ?? "",
            email: initialValues?.email ?? "",
            phone: initialValues?.phone ?? "",
            assignedToId: initialValues?.assignedToId ?? "__unassigned__",
            status: initialValues?.status ?? "new",
        });
    }, [form, initialValues?.assignedToId, initialValues?.email, initialValues?.name, initialValues?.phone, initialValues?.status]);

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <FormInputGroup
                label="Lead Name"
                name="name"
                placeholder="Acme Corporation"
                rules={{ required: "Lead name is required" }}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <FormInputGroup
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="lead@example.com"
                />

                <FormInputGroup
                    label="Phone"
                    name="phone"
                    placeholder="+8801XXXXXXXXX"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormSelectGroup
                    label="Assign To"
                    name="assignedToId"
                    options={[{ value: "__unassigned__", label: "Unassigned" }, ...assigneeOptions]}
                    placeholder="Select assignee"
                />

                <FormSelectGroup
                    label="Status"
                    name="status"
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                />
            </div>

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
                            ? "Create Lead"
                            : "Update Lead"}
                </Button>
            </div>
        </Form>
    );
}