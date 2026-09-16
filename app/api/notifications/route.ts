
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function createOverdueNotifications(userId: number) {
  const now = new Date();

  now.setHours(0, 0, 0, 0);

  const overdueTasks = await prisma.task.findMany({
    where: {
      userId,
      status: {
        not: "COMPLETED",
      },
      dueDate: {
        lt: now,
      },
    },
    select: {
      id: true,
      title: true,
      dueDate: true,
    },
  });

  for (const task of overdueTasks) {
    const message = `Task "${task.title}" is overdue.`;

    const existingNotification =
      await prisma.notification.findFirst({
        where: {
          userId,
          type: "TASK_OVERDUE",
          message,
        },
      });

    if (!existingNotification) {
      await prisma.notification.create({
        data: {
          userId,
          type: "TASK_OVERDUE",
          message,
        },
      });
    }
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check for overdue tasks before returning notifications.
    await createOverdueNotifications(user.id);

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });

    const unreadCount =
      await prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false,
        },
      });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Failed to fetch notifications:",
      error
    );

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to mark notifications as read:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to mark notifications as read",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.notification.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete notifications:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete notifications",
      },
      { status: 500 }
    );
  }
}

