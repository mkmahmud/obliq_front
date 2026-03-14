"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/auth/nav-items";
import { hasAnyPermission, normalizePermissionKeys } from "@/lib/auth/permission-utils";
import { useMyPermissions } from "@/lib/react-query/use-my-permissions";

type DashboardSidebarProps = {
    pathname: string;
    isCollapsed?: boolean;
    isMobile?: boolean;
    isMobileOpen?: boolean;
    onToggleCollapse?: () => void;
    onCloseMobile?: () => void;
};

export function DashboardSidebar({
    pathname,
    isCollapsed = false,
    isMobile = false,
    isMobileOpen = false,
    onToggleCollapse,
    onCloseMobile,
}: DashboardSidebarProps) {
    const { data } = useMyPermissions();
    const dataRecord = data?.data as Record<string, unknown> | undefined;
    const rootRecord = data as Record<string, unknown> | undefined;
    const permissionsPayload = dataRecord?.permissions ?? rootRecord?.permissions ?? data?.data;
    const permissions = normalizePermissionKeys(permissionsPayload);
    const navItems = SIDEBAR_NAV_ITEMS.filter((item) => hasAnyPermission(permissions, item.permission));

    return (
        <aside
            className={cn(
                isMobile
                    ? "fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300 lg:hidden"
                    : "hidden transition-all duration-300 lg:flex lg:flex-col",
                !isMobile && (isCollapsed ? "lg:w-20" : "lg:w-72"),
                isMobile && (isMobileOpen ? "translate-x-0" : "-translate-x-full"),
            )}
        >
            <Card className="h-full gap-0 rounded-none border-r border-border bg-card py-0">
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                    <span className={cn("text-lg font-semibold text-primary", !isMobile && isCollapsed && "sr-only")}>
                        Obliq
                    </span>

                    {isMobile ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCloseMobile}
                            aria-label="Close mobile sidebar"
                        >
                            <X className="size-5" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollapse}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
                        </Button>
                    )}
                </div>

                <nav className="flex-1 p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={isMobile ? onCloseMobile : undefined}
                                className={cn(
                                    "mb-2 flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                    !isMobile && isCollapsed && "justify-center px-2",
                                )}
                                title={item.label}
                            >
                                <Icon className="size-5 shrink-0" />
                                {(isMobile || !isCollapsed) && <span>{item.label}</span>}
                            </Link>
                        );
                    })}

                    {navItems.length === 0 && (
                        <div className="px-2 py-3 text-sm text-muted-foreground">No modules assigned yet.</div>
                    )}
                </nav>
            </Card>
        </aside>
    );
}
