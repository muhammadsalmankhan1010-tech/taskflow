
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notification";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const VALID_STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"] as const;

function formatStatus(status: string) {
  if (status === "IN_PROGRESS") return "In Progress";
  if (status === "COMPLETED") return "Completed";
  return "To Do";
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      priority,
      status,
      dueDate,
    } = body;

    if (
      title !== undefined &&
      (!title || typeof title !== "string" || !title.trim())
    ) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      );
    }

    if (
      priority &&
      !VALID_PRIORITIES.includes(
        priority as (typeof VALID_PRIORITIES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid priority." },
        { status: 400 }
      );
    }

    if (
      status &&
      !VALID_STATUSES.includes(
        status as (typeof VALID_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    let parsedDueDate: Date | null = task.dueDate;

    if (dueDate !== undefined) {
      if (dueDate) {
        parsedDueDate = new Date(dueDate);

        if (Number.isNaN(parsedDueDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid due date." },
            { status: 400 }
          );
        }
      } else {
        parsedDueDate = null;
      }
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title:
          typeof title === "string"
            ? title.trim()
            : task.title,

        description:
          typeof description === "string"
            ? description.trim()
              ? description.trim()
              : null
            : task.description,

        priority:
          priority || task.priority,

        status:
          status || task.status,

        dueDate: parsedDueDate,
      },
    });

    const statusChanged =
      status !== undefined && status !== task.status;

    if (statusChanged) {
      const activityMessage = `Changed task "${updatedTask.title}" to ${formatStatus(
        updatedTask.status
      )}`;

      await createActivity({
        userId: user.id,
        type: "TASK_STATUS_CHANGED",
        message: activityMessage,
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
      });

      await createNotification({
        userId: user.id,
        type: "TASK_STATUS_CHANGED",
        message: `Task "${updatedTask.title}" was changed to ${formatStatus(
          updatedTask.status
        )}.`,
      });
    } else {
      const activityMessage = `Updated task "${updatedTask.title}"`;

      await createActivity({
        userId: user.id,
        type: "TASK_UPDATED",
        message: activityMessage,
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
      });

      await createNotification({
        userId: user.id,
        type: "TASK_UPDATED",
        message: `Task "${updatedTask.title}" was updated successfully.`,
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);

    return NextResponse.json(
      { error: "Failed to update task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID." },
        { status: 400 }
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    await createActivity({
      userId: user.id,
      type: "TASK_DELETED",
      message: `Deleted task "${task.title}"`,
      projectId: task.projectId,
    });

    await createNotification({
      userId: user.id,
      type: "TASK_DELETED",
      message: `Task "${task.title}" was deleted.`,
    });

    return NextResponse.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}
