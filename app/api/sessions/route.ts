import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Get the same authentication cookie created during login
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

    // Delete expired sessions
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Get all active sessions belonging to this user
    const sessions = await prisma.session.findMany({
      where: {
        userId: currentSession.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      sessions: sessions.map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        current: session.id === currentSession.id,
      })),
    });
  } catch (error) {
    console.error("GET /api/sessions error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve sessions." },
      { status: 500 }
    );
  }
}