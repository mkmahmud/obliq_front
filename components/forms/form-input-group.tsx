"use client";

import { ReactNode } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormInputGroupProps<TFieldValues extends FieldValues> = {
    label: string;
    name: Path<TFieldValues>;
    type?: string;
    placeholder?: string;
    rightIcon?: ReactNode;
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
};

function getErrorMessage(error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
        const message = (error as { message?: unknown }).message;
        return typeof message === "string" ? message : undefined;
    }

    return undefined;
}

function getNestedValue(source: unknown, path: string) {
    return path.split(".").reduce<unknown>((acc, key) => {
        if (typeof acc === "object" && acc !== null && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }

        return undefined;
    }, source);
}

export function FormInputGroup<TFieldValues extends FieldValues>({
    label,
    name,
    type = "text",
    placeholder,
    rightIcon,
    rules,
    className,
    inputClassName,
    labelClassName,
}: FormInputGroupProps<TFieldValues>) {
    const {
        register,
        formState: { errors },
    } = useFormContext<TFieldValues>();

    const error = getNestedValue(errors, name);
    const errorMessage = getErrorMessage(error);

    return (
        <div className={cn("space-y-2.5", className)}>
            <Label htmlFor={name} className={cn("text-sm font-medium text-[#646B78]", labelClassName)}>
                {label}
            </Label>

            <div className="relative">
                <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    className={cn(
                        "h-11 rounded-xl border-[#E7E8EB] bg-white pr-11 text-sm",
                        inputClassName,
                    )}
                    aria-invalid={Boolean(errorMessage)}
                    {...register(name, rules)}
                />

                {rightIcon ? (
                    <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[#B6BBC6]">
                        {rightIcon}
                    </span>
                ) : null}
            </div>

            {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        </div>
    );
}
