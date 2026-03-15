"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "../../components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-background text-foreground">
            <div className="flex h-full">
                <DashboardSidebar
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
                />

                {isMobileSidebarOpen && (
                    <button
                        className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                        aria-label="Close sidebar overlay"
                    />
                )}

                <DashboardSidebar
                    pathname={pathname}
                    isMobile
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <header className="z-20 h-16 shrink-0 border-b border-border bg-background/90 backdrop-blur">
                        <div className="flex h-full items-center gap-2 px-4 lg:px-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setIsMobileSidebarOpen(true)}
                                aria-label="Open mobile sidebar"
                            >
                                <Menu className="size-5" />
                            </Button>
                            <h1 className="text-base font-semibold text-foreground">Dashboard</h1>
                        </div>
                    </header>

                    <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
