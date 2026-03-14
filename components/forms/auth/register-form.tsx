"use client";

import { ArrowRight, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { authApi, type RegisterPayload } from "@/lib/api/features/auth";
import { setSessionCookie } from "@/lib/actions/auth-session";
import { Form } from "../form";
import { FormInputGroup } from "../form-input-group";
import { Button } from "@/components/ui/button";

type RegisterFormProps = {
    onSuccess?: () => void;
};

type RegisterFormValues = RegisterPayload;

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: async (response) => {
            await setSessionCookie(response.data.accessToken);
            toast.success(response.message || "Account created successfully");
            onSuccess?.();
            router.push("/dashboard");
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ message?: string | string[] }>;
            const message = axiosError.response?.data?.message;

            if (Array.isArray(message)) {
                toast.error(message[0] || "Unable to register. Please try again.");
                return;
            }

            toast.error(message || "Unable to register. Please try again.");
        },
    });

    const onSubmit = (values: RegisterFormValues) => {
        registerMutation.mutate(values);
    };

    return (
        <Form form={form} onSubmit={onSubmit} className="space-y-5">
            <div className="flex gap-4">
                <FormInputGroup
                    label="First Name"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    rules={{
                        required: "First name is required",
                    }}
                />
                <FormInputGroup
                    label="Last Name"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    rules={{
                        required: "Last name is required",
                    }}
                />
            </div>

            <FormInputGroup
                label="Email"
                name="email"
                type="email"
                placeholder="example@email.com"
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                    },
                }}
            />

            <FormInputGroup
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                rules={{
                    required: "Password is required",
                    minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                    },
                }}
                rightIcon={<Eye className="size-4" />}
            />

            <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full rounded-lg border border-transparent bg-primary py-5 text-base text-primary-foreground transition-colors hover:border-primary hover:bg-white hover:text-primary"
            >
                <span className="transition-transform duration-200 group-hover/button:-translate-x-[4px]">
                    {registerMutation.isPending ? "Creating account..." : "Create account"}
                </span>
                <ArrowRight className="size-4" />
            </Button>
        </Form>
    );
}
