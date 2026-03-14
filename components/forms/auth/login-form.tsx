"use client";

import { ArrowRight, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { authApi, type LoginPayload } from "@/lib/api/features/auth";
import { Form } from "../form";
import { FormCheckboxGroup } from "../form-checkbox-group";
import { FormInputGroup } from "../form-input-group";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
    onSuccess?: () => void;
};

type LoginFormValues = LoginPayload & {
    rememberMe: boolean;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            toast.success(response.message || "Login successful");
            onSuccess?.();
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ message?: string | string[] }>;
            const message = axiosError.response?.data?.message;

            if (Array.isArray(message)) {
                toast.error(message || "Unable to login. Please try again.");
                return;
            }

            toast.error(message || "Unable to login. Please try again.");
        },
    });

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate({
            email: values.email,
            password: values.password,
        });
    };

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-5">
            <FormInputGroup
                label="Email"
                name="email"
                type="email"
                placeholder="example@email.com"
                rules={{
                    required: "Email is required",
                }}
            />

            <FormInputGroup
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                rules={{
                    required: "Password is required",
                }}
                rightIcon={<Eye className="size-4" />}
            />

            <div className="flex items-center justify-between text-sm">
                <FormCheckboxGroup name="rememberMe" label="Remember me" />

                <button type="button" className="font-medium text-[#FF6A3D]">
                    Forgot password?
                </button>
            </div>

            <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="rounded-lg border border-transparent bg-primary py-5 text-base text-primary-foreground transition-colors hover:border-primary hover:bg-white hover:text-primary"
            >
                <span className="transition-transform duration-200 group-hover/button:-translate-x-[4px]">
                    {loginMutation.isPending ? "Logging in..." : "Log in"}
                </span>
                <ArrowRight className="size-4" />
            </Button>
        </Form>
    );
}
