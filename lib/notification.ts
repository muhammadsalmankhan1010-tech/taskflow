
import { prisma } from "@/lib/prisma";

type CreateNotificationInput = {
  userId: number;
  type: string;
  message: string;
};

export async function createNotification({
  userId,
  type,
  message,
}: CreateNotificationInput) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });

    console.log("Notification created:", notification);

    return notification;
  } catch (error) {
    console.error("FAILED TO CREATE NOTIFICATION:", error);
    throw error;
  }
}

