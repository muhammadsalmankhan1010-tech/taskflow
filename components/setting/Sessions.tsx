
"use client";

import { useEffect, useState } from "react";

type Session = {
    id: number;
    createdAt: string;
    expiresAt: string;
    current: boolean;
};

export default function Sessions() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [revokingId, setRevokingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadSessions() {
        try {
            setError("");

            const response = await fetch("/api/sessions");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load sessions."
                );
            }

            setSessions(data.sessions);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load sessions."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSessions();
    }, []);

    async function revokeSession(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to revoke this session?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setRevokingId(id);
            setError("");
            setSuccess("");

            const response = await fetch(`/api/sessions/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to revoke session."
                );
            }

            setSessions((currentSessions) =>
                currentSessions.filter(
                    (session) => session.id !== id
                )
            );

            setSuccess("Session revoked successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to revoke session."
            );
        } finally {
            setRevokingId(null);
        }
    }

    async function revokeOtherSessions() {
        const confirmed = window.confirm(
            "Are you sure you want to sign out of all other sessions?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setRevokingId(-1);
            setError("");
            setSuccess("");

            const response = await fetch(
                "/api/sessions/revoke-others",
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Failed to revoke other sessions."
                );
            }

            await loadSessions();

            setSuccess(
                `${data.revokedCount} other session${
                    data.revokedCount === 1 ? "" : "s"
                } revoked successfully.`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to revoke other sessions."
            );
        } finally {
            setRevokingId(null);
        }
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleString();
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                    Loading active sessions...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {/* Sign Out All Other Sessions */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={revokeOtherSessions}
                    disabled={revokingId !== null}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {revokingId === -1
                        ? "Signing out..."
                        : "Sign out all other sessions"}
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                    <p className="text-sm text-emerald-400">
                        {success}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {/* Sessions */}
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-sm font-semibold text-white">
                                Session #{session.id}
                            </h3>

                            {session.current && (
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                    Current Session
                                </span>
                            )}
                        </div>

                        <div className="mt-3 space-y-1">
                            <p className="text-xs text-slate-500">
                                Signed in:{" "}
                                <span className="text-slate-400">
                                    {formatDate(session.createdAt)}
                                </span>
                            </p>

                            <p className="text-xs text-slate-500">
                                Expires:{" "}
                                <span className="text-slate-400">
                                    {formatDate(session.expiresAt)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Revoke Individual Session */}
                    {!session.current && (
                        <button
                            type="button"
                            onClick={() =>
                                revokeSession(session.id)
                            }
                            disabled={revokingId !== null}
                            className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {revokingId === session.id
                                ? "Revoking..."
                                : "Revoke"}
                        </button>
                    )}
                </div>
            ))}

            {/* No Sessions */}
            {sessions.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                    <p className="text-sm text-slate-400">
                        No active sessions found.
                    </p>
                </div>
            )}
        </div>
    );
}

