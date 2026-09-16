
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserMenu from "@/components/auth/UserMenu";
import NotificationBell from "@/components/layout/NotificationBell";

function formatTaskStatus(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    default:
      return "To Do";
  }
}

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

function getTaskStatusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/10 text-green-400";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-400";
    default:
      return "bg-slate-500/10 text-slate-400";
  }
}

function getProjectStatusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/10 text-green-400";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-400";
    case "PLANNING":
      return "bg-yellow-500/10 text-yellow-400";
    default:
      return "bg-emerald-500/10 text-emerald-400";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatActivityTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date);
}

function getActivityIcon(type: string) {
  switch (type) {
    case "TASK_CREATED":
      return "+";

    case "TASK_UPDATED":
      return "✎";

    case "TASK_STATUS_CHANGED":
      return "✓";

    case "TASK_DELETED":
      return "×";

    case "PROJECT_CREATED":
      return "+";

    case "PROJECT_UPDATED":
      return "✎";

    case "PROJECT_DELETED":
      return "×";

    default:
      return "•";
  }
}

function getActivityIconStyle(type: string) {
  switch (type) {
    case "TASK_CREATED":
    case "PROJECT_CREATED":
      return "bg-green-500/10 text-green-400";

    case "TASK_STATUS_CHANGED":
      return "bg-blue-500/10 text-blue-400";

    case "TASK_DELETED":
    case "PROJECT_DELETED":
      return "bg-red-500/10 text-red-400";

    default:
      return "bg-slate-500/10 text-slate-400";
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [projects, tasks, activities] = await Promise.all([
    prisma.project.findMany({
      where: {
        userId: user.id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.task.findMany({
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
    }),

    prisma.activity.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    }),
  ]);

  // =========================
  // Dynamic Dashboard Stats
  // =========================

  const totalProjects = projects.length;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const inProgressProjects = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const recentProjects = projects.slice(0, 3);

  const recentTasks = tasks.slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900 lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-6">
              <Link href="/" className="text-2xl font-bold">
                Task<span className="text-blue-500">Flow</span>
              </Link>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium"
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
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
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
                <p className="truncate text-sm font-medium text-white">
                  {user.name}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1">
          <header className="flex h-20 items-center justify-between border-b border-white/10 bg-slate-950 px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>

              <p className="text-sm text-slate-500">
                Overview of your workspace
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/projects"
                className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 sm:block"
              >
                + New Project
              </Link>

              <Link
                href="/dashboard/tasks"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
              >
                + New Task
              </Link>

              <NotificationBell />

              <UserMenu
                name={user.name}
                email={user.email}
              />
            </div>
          </header>

          <div className="px-6 py-8 lg:px-8">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Good morning, {user.name.split(" ")[0]} 👋
              </h2>

              <p className="mt-1 text-slate-400">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {/* Total Projects */}
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Total Projects
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalProjects}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Projects in your workspace
                </p>
              </div>

              {/* To Do Tasks */}
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  To Do Tasks
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {todoTasks}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Tasks waiting to be started
                </p>
              </div>

              {/* In Progress */}
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {inProgressTasks}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Tasks currently in progress
                </p>
              </div>

              {/* Completed */}
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Completed Tasks
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {completedTasks}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Tasks completed
                </p>
              </div>

              {/* Overall Progress */}
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Overall Progress
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {overallProgress}%
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${overallProgress}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {completedTasks}/{totalTasks} tasks completed
                </p>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Recent Projects
                  </h2>

                  <p className="text-sm text-slate-500">
                    Your latest projects
                  </p>
                </div>

                <Link
                  href="/dashboard/projects"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View all
                </Link>
              </div>

              {recentProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-8 text-center">
                  <p className="text-slate-400">
                    You don&apos;t have any projects yet.
                  </p>

                  <Link
                    href="/dashboard/projects"
                    className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    Create your first project
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-3">
                  {recentProjects.map((project) => {
                    const projectTasks = project.tasks.length;

                    const completedProjectTasks =
                      project.tasks.filter(
                        (task) => task.status === "COMPLETED"
                      ).length;

                    const progress =
                      projectTasks === 0
                        ? 0
                        : Math.round(
                            (completedProjectTasks /
                              projectTasks) *
                              100
                          );

                    return (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-white/20 hover:bg-slate-800"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">
                              {project.name}
                            </h3>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              {project.description ||
                                "No description"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getProjectStatusStyle(
                              project.status
                            )}`}
                          >
                            {formatProjectStatus(
                              project.status
                            )}
                          </span>
                        </div>

                        <div className="mt-6">
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="text-slate-500">
                              Progress
                            </span>

                            <span className="text-slate-300">
                              {progress}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <p className="mt-3 text-xs text-slate-500">
                            {completedProjectTasks}/
                            {projectTasks} tasks completed
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Recent Tasks
                  </h2>

                  <p className="text-sm text-slate-500">
                    Your latest task activity
                  </p>
                </div>

                <Link
                  href="/dashboard/tasks"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View all
                </Link>
              </div>

              {recentTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-8 text-center">
                  <p className="text-slate-400">
                    You don&apos;t have any tasks yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {task.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {task.project.name}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getTaskStatusStyle(
                            task.status
                          )}`}
                        >
                          {formatTaskStatus(task.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Recent Activity
                  </h2>

                  <p className="text-sm text-slate-500">
                    Latest actions in your workspace
                  </p>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-8 text-center">
                  <p className="text-slate-400">
                    No activity yet.
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Create or update a task to see activity here.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 border-b border-white/10 px-6 py-4 last:border-b-0"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getActivityIconStyle(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-300">
                          {activity.message}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {formatActivityTime(
                            activity.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Workspace Summary */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold">
                Workspace Summary
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">
                    Projects completed
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {completedProjects}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Projects in progress
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {inProgressProjects}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Latest task update
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {recentTasks[0]
                      ? formatDate(recentTasks[0].updatedAt)
                      : "No tasks yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

