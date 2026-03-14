import Link from "next/link";

export default function ForbiddenPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-primary">403</h1>
                <p className="mt-2 text-muted-foreground">You do not have permission to access this page.</p>
                <Link
                    href="/dashboard"
                    className="mt-6 inline-flex rounded-lg border border-primary px-4 py-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                    Back to dashboard
                </Link>
            </div>
        </main>
    );
}
