"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/features/auth";
import { clearSessionCookie } from "@/lib/actions/auth-session";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const router = useRouter();

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: async () => {
            await clearSessionCookie();
            toast.success("Logged out successfully");
            router.push("/login");
        },
        onError: async () => {
            await clearSessionCookie();
            router.push("/login");
        },
    });

    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
                <p className="text-muted-foreground">You are logged in.</p>
            </div>
            <Button
                variant="outline"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
            >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
        </div>
    );
}
