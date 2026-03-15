export function expandPermissionAliases(permission: string): string[] {
    const [module, action = "view"] = permission.split(".");

    const aliases = new Set<string>([
        permission,
        `${module}.${action}`,
        `${module}:${action}`,
        `${module}_${action}`,
        `${action}_${module}`,
        `${action}:${module}`,
        `${action}.${module}`,
        module,
        `${module}.read`,
        `${module}:read`,
        `${module}_read`,
        `read_${module}`,
        `read:${module}`,
        `read.${module}`,
        `${module}.view`,
        `${module}:view`,
        `${module}_view`,
        `view_${module}`,
        `view:${module}`,
        `view.${module}`,
    ]);

    return Array.from(aliases);
}

function tokenizePermission(permission: string): string[] {
    return permission
        .toLowerCase()
        .split(/[._:\-]/g)
        .map((token) => token.trim())
        .filter(Boolean);
}

function collectPermissionStrings(input: unknown): string[] {
    if (typeof input === "string") {
        const value = input.trim();
        return value ? [value] : [];
    }

    if (Array.isArray(input)) {
        return input.flatMap((item) => collectPermissionStrings(item));
    }

    if (!input || typeof input !== "object") {
        return [];
    }

    const record = input as Record<string, unknown>;
    const direct = [record.key, record.permission, record.name, record.module]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean);

    const nested = Object.values(record).flatMap((value) => {
        if (Array.isArray(value) || (value && typeof value === "object")) {
            return collectPermissionStrings(value);
        }

        return [];
    });

    return [...direct, ...nested];
}

export function normalizePermissionKeys(input: unknown): string[] {
    if (!input) {
        return [];
    }

    const keys = collectPermissionStrings(input)
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

    return Array.from(new Set(keys));
}

export function hasAnyPermission(userPermissions: string[], requiredPermission: string): boolean {
    const normalizedUserPermissions = userPermissions.map((value) => value.trim().toLowerCase());
    const userSet = new Set(normalizedUserPermissions);

    if (userSet.has("*") || userSet.has("all") || userSet.has("admin.all")) {
        return true;
    }

    const requiredAliases = expandPermissionAliases(requiredPermission).map((alias) => alias.toLowerCase());
    if (requiredAliases.some((alias) => userSet.has(alias))) {
        return true;
    }

    const [requiredModule, requiredAction = "view"] = requiredPermission.toLowerCase().split(".");
    const actionAliases = new Set([requiredAction, "view", "read"]);

    return normalizedUserPermissions.some((userPermission) => {
        const tokens = tokenizePermission(userPermission);
        const hasModule = tokens.includes(requiredModule);
        if (!hasModule) {
            return false;
        }

        if (tokens.length === 1) {
            return true;
        }

        return tokens.some((token) => actionAliases.has(token));
    });
}

export function normalizeStrictPermissionKeys(input: unknown): string[] {
    if (!input) {
        return [];
    }

    if (typeof input === "string") {
        const value = input.trim().toLowerCase();
        return value ? [value] : [];
    }

    if (Array.isArray(input)) {
        const values = input.flatMap((item) => normalizeStrictPermissionKeys(item));
        return Array.from(new Set(values));
    }

    if (typeof input !== "object") {
        return [];
    }

    const record = input as Record<string, unknown>;
    const directKeys = [record.key, record.permission, record.name]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

    const moduleValue = typeof record.module === "string" ? record.module.trim().toLowerCase() : "";
    const actionValue =
        typeof record.action === "string"
            ? record.action.trim().toLowerCase()
            : typeof record.permissionAction === "string"
                ? record.permissionAction.trim().toLowerCase()
                : "";

    const combinedKey = moduleValue && actionValue ? [`${moduleValue}.${actionValue}`] : [];

    const nested = Object.values(record).flatMap((value) => {
        if (Array.isArray(value) || (value && typeof value === "object")) {
            return normalizeStrictPermissionKeys(value);
        }

        return [];
    });

    return Array.from(new Set([...directKeys, ...combinedKey, ...nested]));
}

export function hasExactPermission(userPermissions: string[], requiredPermission: string): boolean {
    const normalizedRequired = requiredPermission.trim().toLowerCase();
    const userSet = new Set(userPermissions.map((value) => value.trim().toLowerCase()));

    if (userSet.has("*") || userSet.has("all") || userSet.has("admin.all")) {
        return true;
    }

    return userSet.has(normalizedRequired);
}
