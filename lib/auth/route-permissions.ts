export const ROUTE_PERMISSIONS: Array<{ pattern: RegExp; permission: string }> = [
    { pattern: /^\/dashboard(?:\/.*)?$/, permission: "dashboard.view" },
    { pattern: /^\/users(?:\/.*)?$/, permission: "users.manage" },
    { pattern: /^\/permissions(?:\/.*)?$/, permission: "permission.manage" },
    { pattern: /^\/leads(?:\/.*)?$/, permission: "leads.manage" },
    { pattern: /^\/tasks(?:\/.*)?$/, permission: "tasks.manage" },
    { pattern: /^\/reports(?:\/.*)?$/, permission: "reports.manage" },
    { pattern: /^\/audit-logs(?:\/.*)?$/, permission: "audit_logs.view" },
    { pattern: /^\/customer-portal(?:\/.*)?$/, permission: "customer_portal.access" },
    { pattern: /^\/settings(?:\/.*)?$/, permission: "settings.manage" },
];

export function getRequiredPermission(pathname: string): string | null {
    const match = ROUTE_PERMISSIONS.find((route) => route.pattern.test(pathname));
    return match?.permission ?? null;
}
