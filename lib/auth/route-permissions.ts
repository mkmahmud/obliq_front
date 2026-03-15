export const ROUTE_PERMISSIONS: Array<{ pattern: RegExp; permission: string }> = [
    { pattern: /^\/dashboard(?:\/.*)?$/, permission: "dashboard" },
    { pattern: /^\/users(?:\/.*)?$/, permission: "users" },
    { pattern: /^\/permissions(?:\/.*)?$/, permission: "permission" },
    { pattern: /^\/leads(?:\/.*)?$/, permission: "leads" },
    { pattern: /^\/tasks(?:\/.*)?$/, permission: "tasks" },
    { pattern: /^\/reports(?:\/.*)?$/, permission: "reports" },
    { pattern: /^\/audit-logs(?:\/.*)?$/, permission: "audit_logs" },
    { pattern: /^\/customer-portal(?:\/.*)?$/, permission: "customer_portal" },
    { pattern: /^\/settings(?:\/.*)?$/, permission: "settings" },
];

export function getRequiredPermission(pathname: string): string | null {
    const match = ROUTE_PERMISSIONS.find((route) => route.pattern.test(pathname));
    return match?.permission ?? null;
}
