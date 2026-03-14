"use client";

import { ReactNode } from "react";
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

type AppFormProps<TFieldValues extends FieldValues> = {
    form: UseFormReturn<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
    className?: string;
    children: ReactNode;
};

export function Form<TFieldValues extends FieldValues>({
    form,
    onSubmit,
    className,
    children,
}: AppFormProps<TFieldValues>) {
    return (
        <FormProvider {...form}>
            <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
                {children}
            </form>
        </FormProvider>
    );
}
