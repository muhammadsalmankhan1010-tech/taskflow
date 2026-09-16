"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import EditTaskForm from "@/components/tasks/EditTaskForm";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";

type TaskItem = {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  project: {
    id: number;
    name: string;
  };
};

type TaskFiltersProps = {
  tasks: TaskItem[];
};

function formatStatus(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    default:
      return "To Do";
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/10 text-green-400";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-400";
    default:
      return "bg-slate-500/10 text-slate-400";
  }
}

function formatPriority(priority: string) {
  switch (priority) {
    case "HIGH":
      return "High";
    case "LOW":
      return "Low";
    default:
      return "Medium";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getDueDateInfo(date: string | null, status: string) {
  if (!date) {
    return {
      text: "No due date",
      style: "text-slate-500",
    };
  }

  if (status === "COMPLETED") {
    return {
      text: `Due: ${formatDate(new Date(date))}`,
      style: "text-slate-500",
    };
  }

  const now = new Date();
  const due = new Date(date);

  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const difference = due.getTime() - now.getTime();

  const daysUntil = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) {
    return {
      text: `Overdue · ${formatDate(new Date(date))}`,
      style: "text-red-400",
    };
  }

  if (daysUntil === 0) {
    return {
      text: "Due today",
      style: "text-yellow-400",
    };
  }

  if (daysUntil === 1) {
    return {
      text: "Due tomorrow",
      style: "text-yellow-400",
    };
  }

  if (daysUntil <= 7) {
    return {
      text: `Due in ${daysUntil} days`,
      style: "text-yellow-400",
    };
  }

  return {
    text: `Due: ${formatDate(new Date(date))}`,
    style: "text-slate-500",
  };
}

function isOverdue(date: string | null, status: string) {
  if (!date || status === "COMPLETED") {
    return false;
  }

  const now = new Date();
  const due = new Date(date);

  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < now.getTime();
}

export default function TaskFilters({
  tasks,
}: TaskFiltersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [dueFilter, setDueFilter] = useState("ALL");

  const filteredTasks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title.toLowerCase().includes(searchValue) ||
        (task.description || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        task.priority === priorityFilter;

      const matchesDue =
        dueFilter === "ALL" ||
        (dueFilter === "OVERDUE" &&
          isOverdue(task.dueDate, task.status));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDue
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    dueFilter,
  ]);

  const hasFilters =
    search ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    dueFilter !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setDueFilter("ALL");
  }

  return (
    <div>
      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Priority
            </label>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Due */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Due Date
            </label>

            <select
              value={dueFilter}
              onChange={(e) => setDueFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
            >
              <option value="ALL">All Tasks</option>
              <option value="OVERDUE">Overdue Only</option>
            </select>
          </div>
        </div>

        {/* Filter footer */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {filteredTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-300">
              {tasks.length}
            </span>{" "}
            tasks
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredTasks.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900 px-6 py-12 text-center">
          <div className="text-3xl">🔎</div>

          <h3 className="mt-4 text-lg font-semibold">
            No tasks found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          {filteredTasks.map((task) => {
            const dueDateInfo = getDueDateInfo(
              task.dueDate,
              task.status
            );

            return (
              <div
                key={task.id}
                className="border-b border-white/10 p-5 last:border-b-0"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-white">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/projects/${task.project.id}`}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        {task.project.name}
                      </Link>

                      {/* Status is display-only outside Edit mode */}
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                          task.status
                        )}`}
                      >
                        {formatStatus(task.status)}
                      </span>

                      {/* Priority */}
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                          task.priority === "HIGH"
                            ? "bg-red-500/10 text-red-400"
                            : task.priority === "LOW"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {formatPriority(task.priority)}
                      </span>

                      {/* Due date */}
                      <span
                        className={`text-xs ${dueDateInfo.style}`}
                      >
                        {dueDateInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <EditTaskForm
                      taskId={task.id}
                      initialTitle={task.title}
                      initialDescription={task.description}
                      initialPriority={task.priority}
                      initialStatus={task.status}
                      initialDueDate={task.dueDate}
                    />

                    <DeleteTaskButton taskId={task.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}