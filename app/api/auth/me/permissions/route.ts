import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
        return NextResponse.json({ message: "API base URL is not configured" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${apiBaseUrl}/auth/me/permissions`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}
