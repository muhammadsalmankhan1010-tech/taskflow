import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TaskFilters from "@/components/tasks/TaskFilters";

export default async function TasksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "COMPLETED") {
      return false;
    }

    const now = new Date();
    const due = new Date(task.dueDate);

    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due.getTime() < now.getTime();
  }).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900 lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <Link
                href="/"
                className="text-2xl font-bold"
              >
                Task<span className="text-blue-500">Flow</span>
              </Link>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>⌂</span>
                Dashboard
              </Link>

              <Link
                href="/dashboard/projects"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>▣</span>
                Projects
              </Link>

              <Link
                href="/dashboard/tasks"
                className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium"
              >
                <span>✓</span>
                Tasks
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>⚙</span>
                Settings
              </Link>
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className="rounded-xl bg-white/5 px-3 py-3">
                <p className="truncate text-sm font-medium">
                  {user.name}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">
          <header className="flex h-20 items-center justify-between border-b border-white/10 bg-slate-950 px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-semibold">
                Tasks
              </h1>

              <p className="text-sm text-slate-500">
                Manage all your tasks
              </p>
            </div>

            <Link
              href="/dashboard/projects"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
            >
              + New Task
            </Link>
          </header>

          <div className="px-6 py-8 lg:px-8">
            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Total Tasks
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  To Do
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {todoTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {inProgressTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {completedTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Overdue
                </p>

                <p className="mt-2 text-3xl font-bold text-red-400">
                  {overdueTasks}
                </p>
              </div>
            </div>

            {/* Tasks */}
            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  All Tasks
                </h2>

                <p className="text-sm text-slate-500">
                  Tasks from all your projects
                </p>
              </div>

              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    You don&apos;t have any tasks yet.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Create a task from inside one of your
                    projects.
                  </p>

                  <Link
                    href="/dashboard/projects"
                    className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
                  >
                    Go to Projects
                  </Link>
                </div>
              ) : (
                <TaskFilters
                  tasks={tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: task.dueDate?.toISOString() ?? null,
                    project: {
                      id: task.project.id,
                      name: task.project.name,
                    },
                  }))}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
