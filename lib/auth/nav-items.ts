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
    { label: "Dashboard", href: "/dashboard", permission: "dashboard.view", icon: LayoutDashboard },
    { label: "Users", href: "/users", permission: "users.manage", icon: Users },
    { label: "All Permissions", href: "/permissions", permission: "permission.manage", icon: ShieldCheck },
    { label: "Leads", href: "/leads", permission: "leads.manage", icon: Briefcase },
    { label: "Tasks", href: "/tasks", permission: "tasks.manage", icon: CheckSquare },
    { label: "Reports", href: "/reports", permission: "reports.manage", icon: BarChart3 },
    { label: "Audit Logs", href: "/audit-logs", permission: "audit_logs.view", icon: ClipboardList },
    { label: "Customer Portal", href: "/customer-portal", permission: "customer_portal.access", icon: UserRound },
    { label: "Settings", href: "/settings", permission: "settings.manage", icon: Settings },
];
