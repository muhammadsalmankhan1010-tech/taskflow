import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("taskflow_session")?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: {
          token: sessionToken,
        },
      });
    }

    const response = NextResponse.json({
      message: "Logged out successfully.",
    });

    response.cookies.set("taskflow_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Failed to logout." },
      { status: 500 }
    );
  }
}