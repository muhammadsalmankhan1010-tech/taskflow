import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditProjectForm from "@/components/projects/EditProjectForm";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import AddTaskForm from "@/components/tasks/AddTaskForm";
import EditTaskForm from "@/components/tasks/EditTaskForm";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";
import TaskStatusButton from "@/components/tasks/TaskStatusButton";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatStatus(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "IN_PROGRESS":
      return "In Progress";
    case "PLANNING":
      return "Planning";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "PLANNING":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "IN_PROGRESS":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
}

export default async function ProjectDetailsPage({
  params,
}: ProjectPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
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
    notFound();
  }

  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">

        <Link
          href="/dashboard/projects"
          className="inline-flex items-center text-sm text-slate-400 transition hover:text-white"
        >
          ? Back to Projects
        </Link>

        <div className="mt-8 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                ?
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Project
                </p>

                <h1 className="text-3xl font-bold">
                  {project.name}
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              {project.description ||
                "No description provided for this project."}
            </p>
          </div>

          <div className="flex gap-3">
            <EditProjectForm
              projectId={project.id}
              initialName={project.name}
              initialDescription={project.description}
              initialStatus={project.status}
            />

            <DeleteProjectButton projectId={project.id} />
          </div>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Status
            </p>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusStyle(
                  project.status
                )}`}
              >
                {formatStatus(project.status)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Tasks
            </p>

            <p className="mt-3 text-3xl font-bold">
              {project.tasks.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {completedTasks} completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Created
            </p>

            <p className="mt-3 text-lg font-semibold">
              {project.createdAt.toLocaleDateString()}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Last updated {project.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="font-semibold">
                Project Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tasks associated with this project.
              </p>
            </div>

            <AddTaskForm projectId={project.id} />
          </div>

          {project.tasks.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-400">
                ?
              </div>

              <h3 className="mt-5 font-semibold">
                No tasks yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add tasks to start managing this project.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div className="min-w-0">
                    <h3 className="font-medium">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${task.priority === "HIGH"
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : task.priority === "MEDIUM"
                            ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        }`}
                    >
                      {task.priority === "HIGH"
                        ? "High"
                        : task.priority === "MEDIUM"
                          ? "Medium"
                          : "Low"}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${task.status === "COMPLETED"
                          ? "border-green-500/20 bg-green-500/10 text-green-400"
                          : task.status === "IN_PROGRESS"
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        }`}
                    >
                      {task.status === "IN_PROGRESS"
                        ? "In Progress"
                        : task.status === "COMPLETED"
                          ? "Completed"
                          : "To Do"}
                    </span>

                    <EditTaskForm
                      taskId={task.id}
                      initialTitle={task.title}
                      initialDescription={task.description}
                      initialPriority={task.priority}
                      initialStatus={task.status}
                      initialDueDate={task.dueDate?.toISOString() ?? null}
                    />

                    <DeleteTaskButton taskId={task.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

