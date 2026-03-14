"use client";

import { FieldValues, Path, useController, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormCheckboxGroupProps<TFieldValues extends FieldValues> = {
    name: Path<TFieldValues>;
    label: string;
    className?: string;
    labelClassName?: string;
    checkboxClassName?: string;
};

export function FormCheckboxGroup<TFieldValues extends FieldValues>({
    name,
    label,
    className,
    labelClassName,
    checkboxClassName,
}: FormCheckboxGroupProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();
    const { field } = useController({ control, name });

    return (
        <Label className={cn("flex items-center gap-2 text-[#9AA0AB]", labelClassName, className)}>
            <Checkbox
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                className={cn("size-3.5 border-[#D6DAE2]", checkboxClassName)}
            />
            <span>{label}</span>
        </Label>
    );
}
