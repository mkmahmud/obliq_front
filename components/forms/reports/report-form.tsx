"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/forms/form";
import { FormInputGroup } from "@/components/forms/form-input-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type ReportFormValues = {
    title: string;
    type: string;
    dataJson: string;
};

type ReportFormProps = {
    mode: "create" | "edit";
    initialValues?: Partial<ReportFormValues>;
    isSubmitting?: boolean;
    onSubmit: (values: ReportFormValues) => void;
    onCancel?: () => void;
};

export function ReportForm({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: ReportFormProps) {
    const form = useForm<ReportFormValues>({
        defaultValues: {
            title: initialValues?.title ?? "",
            type: initialValues?.type ?? "",
            dataJson: initialValues?.dataJson ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            title: initialValues?.title ?? "",
            type: initialValues?.type ?? "",
            dataJson: initialValues?.dataJson ?? "",
        });
    }, [form, initialValues?.dataJson, initialValues?.title, initialValues?.type]);

    const dataJsonError = form.formState.errors.dataJson?.message;

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <FormInputGroup
                label="Title"
                name="title"
                placeholder="Monthly Sales Summary"
                rules={{ required: "Title is required" }}
            />

            <FormInputGroup
                label="Type"
                name="type"
                placeholder="sales"
                rules={{ required: "Type is required" }}
            />

            <div className="space-y-2.5">
                <Label htmlFor="dataJson" className="text-sm font-medium text-[#646B78]">
                    Data (JSON)
                </Label>
                <textarea
                    id="dataJson"
                    placeholder='{"total": 100, "period": "monthly"}'
                    className="min-h-36 w-full rounded-xl border border-[#E7E8EB] bg-white px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
                    aria-invalid={Boolean(dataJsonError)}
                    {...form.register("dataJson", {
                        validate: (value) => {
                            if (!value.trim()) {
                                return true;
                            }

                            try {
                                JSON.parse(value);
                                return true;
                            } catch {
                                return "Enter valid JSON data";
                            }
                        },
                    })}
                />
                {dataJsonError ? <p className="text-sm text-red-500">{dataJsonError}</p> : null}
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
                            ? "Create Report"
                            : "Update Report"}
                </Button>
            </div>
        </Form>
    );
}