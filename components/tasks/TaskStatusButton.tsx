"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TaskStatusButtonProps = {
  taskId: number;
  currentStatus: string;
};

export default function TaskStatusButton({
  taskId,
  currentStatus,
}: TaskStatusButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(
    newStatus: "TODO" | "IN_PROGRESS" | "COMPLETED"
  ) {
    if (newStatus === currentStatus) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update task status.");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentStatus}
      disabled={loading}
      onChange={(e) =>
        handleStatusChange(
          e.target.value as "TODO" | "IN_PROGRESS" | "COMPLETED"
        )
      }
      className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="TODO">Todo</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
    </select>
  );
}
