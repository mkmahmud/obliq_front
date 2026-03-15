import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    BarChart3,
    ClipboardList,
    UserRound,
    Settings,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

export type SidebarNavItem = {
    label: string;
    href: string;
    permission: string;
    icon: LucideIcon;
};

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
    { label: "Dashboard", href: "/dashboard", permission: "dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/users", permission: "users", icon: Users },
    { label: "All Permissions", href: "/permissions", permission: "permission", icon: ShieldCheck },
    { label: "Leads", href: "/leads", permission: "leads", icon: Briefcase },
    { label: "Tasks", href: "/tasks", permission: "tasks", icon: CheckSquare },
    { label: "Reports", href: "/reports", permission: "reports", icon: BarChart3 },
    { label: "Audit Logs", href: "/audit-logs", permission: "audit_logs", icon: ClipboardList },
    { label: "Customer Portal", href: "/customer-portal", permission: "customer_portal", icon: UserRound },
    { label: "Settings", href: "/settings", permission: "settings", icon: Settings },
];
