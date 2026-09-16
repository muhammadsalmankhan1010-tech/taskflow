import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const preferences = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        taskNotifications: true,
        projectNotifications: true,
        emailNotifications: true,
      },
    });

    if (!preferences) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      preferences,
    });
  } catch (error) {
    console.error("Notification preferences GET error:", error);

    return NextResponse.json(
      { error: "Failed to load notification preferences." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const taskNotifications = body.taskNotifications;
    const projectNotifications = body.projectNotifications;
    const emailNotifications = body.emailNotifications;

    if (
      typeof taskNotifications !== "boolean" ||
      typeof projectNotifications !== "boolean" ||
      typeof emailNotifications !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid notification preferences." },
        { status: 400 }
      );
    }

    const preferences = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        taskNotifications,
        projectNotifications,
        emailNotifications,
      },
      select: {
        taskNotifications: true,
        projectNotifications: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json({
      message: "Notification preferences updated successfully.",
      preferences,
    });
  } catch (error) {
    console.error("Notification preferences PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update notification preferences." },
      { status: 500 }
    );
  }
}
