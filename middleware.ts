import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequiredPermission } from "@/lib/auth/route-permissions";
import { hasAnyPermission, normalizePermissionKeys } from "./lib/auth/permission-utils";

const PUBLIC_ROUTES = ["/login", "/register", "/403"];
const AUTH_REDIRECT_ROUTES = ["/login", "/register"];
const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";
const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length < 2) {
            return null;
        }

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const json = atob(padded);
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function isAdminToken(token: string): boolean {
    const payload = decodeJwtPayload(token);

    if (!payload) {
        return false;
    }

    const role = payload.role;
    if (typeof role === "string" && role.toLowerCase() === "admin") {
        return true;
    }

    const roles = payload.roles;
    if (Array.isArray(roles)) {
        return roles.some((item) => typeof item === "string" && item.toLowerCase() === "admin");
    }

    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get("accessToken")?.value;
    const isAuthenticated = !!accessToken;
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthRedirectRoute = AUTH_REDIRECT_ROUTES.some((route) => pathname.startsWith(route));
    const hasCallbackUrl = request.nextUrl.searchParams.has("callbackUrl");
    const hasSessionExpiredReason = request.nextUrl.searchParams.get("reason") === "session-expired";

    // Authenticated user trying to access login/register → redirect to dashboard
    if (isAuthenticated && isAuthRedirectRoute && !hasCallbackUrl && !hasSessionExpiredReason) {
        return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_REDIRECT, request.url));
    }

    // Unauthenticated user trying to access protected route → redirect to login
    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && !isPublicRoute) {
        const requiredPermission = getRequiredPermission(pathname);

        if (requiredPermission === "dashboard.view") {
            return NextResponse.next();
        }

        if (accessToken && isAdminToken(accessToken)) {
            return NextResponse.next();
        }

        if (requiredPermission) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!apiBaseUrl) {
                return NextResponse.redirect(new URL("/403", request.url));
            }

            try {
                const response = await fetch(`${apiBaseUrl}/auth/me/permissions`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    cache: "no-store",
                });

                if (!response.ok) {
                    const loginUrl = new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, request.url);
                    loginUrl.searchParams.set("callbackUrl", pathname);
                    return NextResponse.redirect(loginUrl);
                }

                const json = (await response.json()) as {
                    data?: { permissions?: unknown } | unknown;
                    permissions?: unknown;
                };

                const permissions = normalizePermissionKeys(
                    (json.data as { permissions?: unknown })?.permissions ?? json.permissions ?? json.data,
                );

                if (!hasAnyPermission(permissions, requiredPermission)) {
                    return NextResponse.redirect(new URL("/403", request.url));
                }
            } catch {
                return NextResponse.redirect(new URL("/403", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public folder files (images, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
    ],
};
