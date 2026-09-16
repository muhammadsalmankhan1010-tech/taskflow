
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notification";

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const VALID_STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"] as const;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      projectId,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    const parsedProjectId = Number(projectId);

    if (!Number.isInteger(parsedProjectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
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

    const project = await prisma.project.findFirst({
      where: {
        id: parsedProjectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    let parsedDueDate: Date | null = null;

    if (dueDate) {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid due date." },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        priority: priority || "MEDIUM",
        status: status || "TODO",
        dueDate: parsedDueDate,
        projectId: parsedProjectId,
        userId: user.id,
      },
    });

    await createActivity({
      userId: user.id,
      type: "TASK_CREATED",
      message: `Created task "${task.title}"`,
      projectId: project.id,
      taskId: task.id,
    });
    await createNotification({
      userId: user.id,
      type: "TASK_CREATED",
      message: `Task "${task.title}" was created successfully.`,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);

    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 }
    );
  }
}

