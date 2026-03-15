"use client";

import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SelectOption = {
    value: string;
    label: string;
};

type FormSelectGroupProps<TFieldValues extends FieldValues> = {
    label: string;
    name: Path<TFieldValues>;
    options: SelectOption[];
    placeholder?: string;
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
    className?: string;
    selectClassName?: string;
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

export function FormSelectGroup<TFieldValues extends FieldValues>({
    label,
    name,
    options,
    placeholder = "Select option",
    rules,
    className,
    selectClassName,
    labelClassName,
}: FormSelectGroupProps<TFieldValues>) {
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

            <select
                id={name}
                className={cn(
                    "h-11 w-full rounded-xl border border-[#E7E8EB] bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30",
                    selectClassName,
                )}
                aria-invalid={Boolean(errorMessage)}
                defaultValue=""
                {...register(name, rules)}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        </div>
    );
}
