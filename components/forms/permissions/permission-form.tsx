"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/forms/form";
import { FormInputGroup } from "@/components/forms/form-input-group";
import { FormSelectGroup } from "@/components/forms/form-select-group";
import { Button } from "@/components/ui/button";

export type PermissionFormValues = {
    key: string;
    module: string;
    action: string;
    description: string;
};

type PermissionFormProps = {
    mode: "create" | "edit";
    initialValues?: Partial<PermissionFormValues>;
    isSubmitting?: boolean;
    onSubmit: (values: PermissionFormValues) => void;
    onCancel?: () => void;
};

const MODULE_OPTIONS = [
    { value: "dashboard", label: "Dashboard" },
    { value: "users", label: "Users" },
    { value: "leads", label: "Leads" },
    { value: "tasks", label: "Tasks" },
    { value: "reports", label: "Reports" },
    { value: "audit_logs", label: "Audit Logs" },
    { value: "customer_portal", label: "Customer Portal" },
    { value: "settings", label: "Settings" },
];

const ACTION_OPTIONS = [
    { value: "create", label: "Create" },
    { value: "read", label: "Read" },
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" },
];

function getActionFromKey(key?: string) {
    if (!key) {
        return "";
    }

    const parts = key.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
}

export function PermissionForm({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: PermissionFormProps) {
    const form = useForm<PermissionFormValues>({
        defaultValues: {
            key: initialValues?.key ?? "",
            module: initialValues?.module ?? "",
            action: getActionFromKey(initialValues?.key),
            description: initialValues?.description ?? "",
        },
    });

    const selectedModule = form.watch("module");
    const selectedAction = form.watch("action");

    useEffect(() => {
        form.reset({
            key: initialValues?.key ?? "",
            module: initialValues?.module ?? "",
            action: getActionFromKey(initialValues?.key),
            description: initialValues?.description ?? "",
        });
    }, [form, initialValues?.description, initialValues?.key, initialValues?.module]);

    useEffect(() => {
        if (selectedModule && selectedAction) {
            form.setValue("key", `${selectedModule}.${selectedAction}`, {
                shouldDirty: true,
            });
        }
    }, [form, selectedAction, selectedModule]);

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <FormSelectGroup
                label="Module"
                name="module"
                options={MODULE_OPTIONS}
                placeholder="Select module"
                rules={{
                    required: "Module is required",
                }}
            />

            <FormSelectGroup
                label="Action"
                name="action"
                options={ACTION_OPTIONS}
                placeholder="Select action"
                rules={{
                    required: "Action is required",
                }}
            />



            <div className="space-y-2.5">
                <p className="text-sm font-medium text-[#646B78]">Generated Key</p>
                <div className="h-11 rounded-xl border border-[#E7E8EB] bg-white px-3 text-sm text-foreground flex items-center">
                    {selectedModule && selectedAction ? `${selectedModule}.${selectedAction}` : "Select module and action"}
                </div>
            </div>

            <FormInputGroup
                label="Description"
                name="description"
                placeholder="Allows creating permissions"
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
                            ? "Create Permission"
                            : "Update Permission"}
                </Button>
            </div>
        </Form>
    );
}
