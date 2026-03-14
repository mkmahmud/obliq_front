"use server";

import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "accessToken";
const ACCESS_TOKEN_MAX_AGE = 60 * 15;

export async function setSessionCookie(accessToken: string) {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
}
