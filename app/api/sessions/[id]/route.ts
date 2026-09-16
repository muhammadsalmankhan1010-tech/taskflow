import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();

        const sessionToken = cookieStore.get("taskflow_session")?.value;

        if (!sessionToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find the current session
        const currentSession = await prisma.session.findUnique({
            where: {
                token: sessionToken,
            },
        });

        if (!currentSession) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const sessionId = Number(id);

        if (!Number.isInteger(sessionId)) {
            return NextResponse.json(
                { error: "Invalid session ID." },
                { status: 400 }
            );
        }

        // Find the session that should be revoked
        const sessionToDelete = await prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });

        if (!sessionToDelete) {
            return NextResponse.json(
                { error: "Session not found." },
                { status: 404 }
            );
        }

        // Make sure the session belongs to the logged-in user
        if (sessionToDelete.userId !== currentSession.userId) {
            return NextResponse.json(
                { error: "You cannot revoke this session." },
                { status: 403 }
            );
        }

        // Prevent revoking the current session
        if (sessionToDelete.id === currentSession.id) {
            return NextResponse.json(
                { error: "You cannot revoke your current session." },
                { status: 400 }
            );
        }

        await prisma.session.delete({
            where: {
                id: sessionId,
            },
        });

        return NextResponse.json({
            message: "Session revoked successfully.",
        });
    } catch (error) {
        console.error("DELETE /api/sessions/[id] error:", error);

        return NextResponse.json(
            { error: "Failed to revoke session." },
            { status: 500 }
        );
    }
}