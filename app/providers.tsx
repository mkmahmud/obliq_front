"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { getQueryClient } from "../lib/react-query/query-client";


type ProvidersProps = {
    children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster richColors position="top-center" />
        </QueryClientProvider>
    );
}
