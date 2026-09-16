
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notification";

function formatProjectStatus(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "PLANNING":
      return "Planning";
    case "COMPLETED":
      return "Completed";
    default:
      return "Active";
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);

    return NextResponse.json(
      { error: "Failed to fetch project." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { name, description, status } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Project name is required." },
        { status: 400 }
      );
    }

    const validStatuses = [
      "ACTIVE",
      "IN_PROGRESS",
      "PLANNING",
      "COMPLETED",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid project status." },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: status || existingProject.status,
      },
    });

    const statusChanged =
      status !== undefined && status !== existingProject.status;

    if (statusChanged) {
      const message = `Changed project "${updatedProject.name}" to ${formatProjectStatus(
        updatedProject.status
      )}`;

      await createActivity({
        userId: user.id,
        type: "PROJECT_STATUS_CHANGED",
        message,
        projectId: updatedProject.id,
      });

      await createNotification({
        userId: user.id,
        type: "PROJECT_STATUS_CHANGED",
        message,
      });
    } else {
      const message = `Updated project "${updatedProject.name}"`;

      await createActivity({
        userId: user.id,
        type: "PROJECT_UPDATED",
        message,
        projectId: updatedProject.id,
      });

      await createNotification({
        userId: user.id,
        type: "PROJECT_UPDATED",
        message,
      });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);

    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID." },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    const message = `Deleted project "${existingProject.name}"`;

    await createActivity({
      userId: user.id,
      type: "PROJECT_DELETED",
      message,
    });

    await createNotification({
      userId: user.id,
      type: "PROJECT_DELETED",
      message,
    });

    return NextResponse.json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}

