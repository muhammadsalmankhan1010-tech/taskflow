import { prisma } from "@/lib/prisma";

type CreateActivityInput = {
  userId: number;
  type: string;
  message: string;
  projectId?: number;
  taskId?: number;
};

export async function createActivity({
  userId,
  type,
  message,
  projectId,
  taskId,
}: CreateActivityInput) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        message,
        projectId,
        taskId,
      },
    });
  } catch (error) {
    console.error("Failed to create activity:", error);
  }
}