import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    try {
        const cookieStore = await cookies();

        const sessionToken =
            cookieStore.get("taskflow_session")?.value;

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

        // Delete every session except the current one
        const result = await prisma.session.deleteMany({
            where: {
                userId: currentSession.userId,
                id: {
                    not: currentSession.id,
                },
            },
        });

        return NextResponse.json({
            message: "All other sessions have been revoked.",
            revokedCount: result.count,
        });
    } catch (error) {
        console.error(
            "DELETE /api/sessions/revoke-others error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to revoke other sessions." },
            { status: 500 }
        );
    }
}