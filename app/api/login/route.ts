import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password
    const hashedPassword = hashPassword(password);

    if (hashedPassword !== user.password) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create secure session token
    const sessionToken = crypto.randomBytes(32).toString("hex");

    // Session duration
    const sessionDuration = remember
      ? 60 * 60 * 24 * 30
      : 60 * 60 * 24;

    const expiresAt = new Date(
      Date.now() + sessionDuration * 1000
    );

    // Save session in database
    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Store session token in HTTP-only cookie
    response.cookies.set("taskflow_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDuration,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Failed to login." },
      { status: 500 }
    );
  }
}