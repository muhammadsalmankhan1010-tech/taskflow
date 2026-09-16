import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sessions from "@/components/setting/Sessions";

export default async function SessionsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/settings"
                        className="mb-6 inline-flex items-center text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Back to Settings
                    </Link>

                    <h1 className="text-2xl font-bold">
                        Active Sessions
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage devices currently signed into your TaskFlow account.
                    </p>
                </div>

                {/* Sessions */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                    <div className="border-b border-white/10 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-400">
                                💻
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Your Sessions
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    These are the active sessions associated with your account.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Sessions />
                    </div>
                </section>

                {/* Info */}
                <div className="mt-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                    <p className="text-xs leading-5 text-slate-400">
                        Your current session is marked as{" "}
                        <span className="font-medium text-emerald-400">
                            Current Session
                        </span>
                        . Other sessions can be revoked to sign those devices out.
                    </p>
                </div>
            </div>
        </main>
    );
}