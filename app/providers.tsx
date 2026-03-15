"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { getQueryClient } from "../lib/react-query/query-client";


type ProvidersProps = {
    children: ReactNode;
};

function UnauthorizedRedirectBridge() {
    const router = useRouter();

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ callbackUrl?: string; reason?: string }>;
            const callbackUrl = customEvent.detail?.callbackUrl ?? "/dashboard";
            const reason = customEvent.detail?.reason ?? "session-expired";

            const params = new URLSearchParams();
            params.set("callbackUrl", callbackUrl);
            params.set("reason", reason);

            router.replace(`/login?${params.toString()}`);
        };

        window.addEventListener("app:unauthorized", handler as EventListener);

        return () => {
            window.removeEventListener("app:unauthorized", handler as EventListener);
        };
    }, [router]);

    return null;
}

export function Providers({ children }: ProvidersProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <UnauthorizedRedirectBridge />
            {children}
            <Toaster richColors position="top-center" />
        </QueryClientProvider>
    );
}
