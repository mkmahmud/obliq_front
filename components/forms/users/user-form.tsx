"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/forms/form";
import { FormInputGroup } from "@/components/forms/form-input-group";
import { FormSelectGroup } from "@/components/forms/form-select-group";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/api/features/users";

export type UserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    managerId: string;
};

type UserFormProps = {
    mode: "create" | "edit";
    initialValues?: Partial<UserFormValues>;
    isSubmitting?: boolean;
    onSubmit: (values: UserFormValues) => void;
    onCancel?: () => void;
};

const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "agent", label: "Agent" },
    { value: "customer", label: "Customer" },
];

export function UserForm({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: UserFormProps) {
    const form = useForm<UserFormValues>({
        defaultValues: {
            firstName: initialValues?.firstName ?? "",
            lastName: initialValues?.lastName ?? "",
            email: initialValues?.email ?? "",
            password: "",
            role: (initialValues?.role as UserRole | undefined) ?? "agent",
            managerId: initialValues?.managerId ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            firstName: initialValues?.firstName ?? "",
            lastName: initialValues?.lastName ?? "",
            email: initialValues?.email ?? "",
            password: "",
            role: (initialValues?.role as UserRole | undefined) ?? "agent",
            managerId: initialValues?.managerId ?? "",
        });
    }, [form, initialValues?.email, initialValues?.firstName, initialValues?.lastName, initialValues?.managerId, initialValues?.role]);

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <FormInputGroup
                    label="First Name"
                    name="firstName"
                    placeholder="John"
                    rules={{ required: "First name is required" }}
                />

                <FormInputGroup
                    label="Last Name"
                    name="lastName"
                    placeholder="Doe"
                    rules={{ required: "Last name is required" }}
                />
            </div>

            <FormInputGroup
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                    },
                }}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <FormSelectGroup
                    label="Role"
                    name="role"
                    options={ROLE_OPTIONS}
                    placeholder="Select role"
                    rules={{ required: "Role is required" }}
                />

                <FormInputGroup
                    label="Manager ID (optional)"
                    name="managerId"
                    placeholder="Manager UUID"
                />
            </div>

            <FormInputGroup
                label={mode === "create" ? "Password" : "Password (leave blank to keep current)"}
                name="password"
                type="password"
                placeholder={mode === "create" ? "Enter password" : "Optional new password"}
                rules={
                    mode === "create"
                        ? {
                              required: "Password is required",
                              minLength: {
                                  value: 8,
                                  message: "Password must be at least 8 characters",
                              },
                          }
                        : {
                              validate: (value) =>
                                  !value || value.length >= 8 || "Password must be at least 8 characters",
                          }
                }
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
                            ? "Create User"
                            : "Update User"}
                </Button>
            </div>
        </Form>
    );
}
