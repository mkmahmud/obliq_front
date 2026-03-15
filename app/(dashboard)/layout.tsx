"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";

import { getRequiredPermission } from "@/lib/auth/route-permissions";
import { hasAnyPermission } from "@/lib/auth/permission-utils";
import { useMyPermissions } from "@/lib/react-query/use-my-permissions";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "../../components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const myPermissionsQuery = useMyPermissions();

    const requiredPermission = useMemo(() => getRequiredPermission(pathname), [pathname]);
    const isPermissionCheckInProgress =
        Boolean(requiredPermission) &&
        requiredPermission !== "dashboard.view" &&
        myPermissionsQuery.isLoading;

    useEffect(() => {
        if (!requiredPermission) {
            return;
        }

        if (requiredPermission === "dashboard.view") {
            return;
        }

        if (myPermissionsQuery.isLoading || myPermissionsQuery.isFetching || myPermissionsQuery.isError) {
            return;
        }

        const permissions = myPermissionsQuery.data?.data?.permissions ?? [];

        if (permissions.length === 0) {
            return;
        }

        if (!hasAnyPermission(permissions, requiredPermission)) {
            router.replace("/403");
        }
    }, [
        myPermissionsQuery.data?.data?.permissions,
        myPermissionsQuery.isError,
        myPermissionsQuery.isFetching,
        myPermissionsQuery.isLoading,
        requiredPermission,
        router,
    ]);

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

                    <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
                        {isPermissionCheckInProgress ? (
                            <div className="flex min-h-[240px] items-center justify-center">
                                <p className="text-sm text-muted-foreground">Checking page access...</p>
                            </div>
                        ) : (
                            children
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
