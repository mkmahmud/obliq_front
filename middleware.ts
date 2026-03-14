import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];
const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";
const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const isAuthenticated = !!accessToken;
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // Authenticated user trying to access login/register → redirect to dashboard
    if (isAuthenticated && isPublicRoute) {
        return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_REDIRECT, request.url));
    }

    // Unauthenticated user trying to access protected route → redirect to login
    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
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
