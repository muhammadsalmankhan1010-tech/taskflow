"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import ProjectActions from "@/components/projects/ProjectActions";

type Project = {
  id: number | string;
  name: string;
  description: string | null;
  status: string;
  createdAt?: string;
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.49a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 11a1.7 1.7 0 0 0-.34-1.88L9 9.06l1.41-1.41.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.38 6.5V6h2v.5A1.7 1.7 0 0 0 16.41 8a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03H22v2h-1.08A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Projects");

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setCreating(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create project"
        );
      }

      setProjects((currentProjects) => [
        data,
        ...currentProjects,
      ]);

      setName("");
      setDescription("");
      setStatus("ACTIVE");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating project:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create project"
      );
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (project.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    let matchesStatus = true;

    if (filterStatus === "In Progress") {
      matchesStatus =
        project.status === "IN_PROGRESS" ||
        project.status === "In Progress";
    }

    if (filterStatus === "Planning") {
      matchesStatus =
        project.status === "PLANNING" ||
        project.status === "Planning";
    }

    if (filterStatus === "Completed") {
      matchesStatus =
        project.status === "COMPLETED" ||
        project.status === "Completed";
    }

    return matchesSearch && matchesStatus;
  });

  const formatStatus = (projectStatus: string) => {
    switch (projectStatus) {
      case "ACTIVE":
        return "Active";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "PLANNING":
        return "Planning";
      default:
        return projectStatus;
    }
  };

  const getStatusStyle = (projectStatus: string) => {
    switch (projectStatus) {
      case "COMPLETED":
      case "Completed":
        return "bg-green-500/10 text-green-400";

      case "PLANNING":
      case "Planning":
        return "bg-yellow-500/10 text-yellow-400";

      case "IN_PROGRESS":
      case "In Progress":
        return "bg-blue-500/10 text-blue-400";

      default:
        return "bg-blue-500/10 text-blue-400";
    }
  };

  const getProgressWidth = (projectStatus: string) => {
    switch (projectStatus) {
      case "COMPLETED":
      case "Completed":
        return "100%";

      case "IN_PROGRESS":
      case "In Progress":
        return "50%";

      case "PLANNING":
      case "Planning":
        return "10%";

      default:
        return "10%";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

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
                <HomeIcon />
                Dashboard
              </Link>

              <Link
                href="/dashboard/projects"
                className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium"
              >
                <FolderIcon />
                Projects
              </Link>

              <Link
                href="/dashboard/tasks"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <CheckIcon />
                Tasks
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <SettingsIcon />
                Settings
              </Link>

            </nav>

            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3 rounded-xl p-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
                  MS
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Muhammad Salman
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    Administrator
                  </p>
                </div>

              </div>
            </div>

          </div>
        </aside>

        <section className="flex-1">

          <header className="border-b border-white/10 bg-slate-950 px-6 py-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="mb-2 flex items-center gap-2 text-sm">

                  <Link
                    href="/dashboard"
                    className="text-slate-500 transition hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <span className="text-slate-700">
                    /
                  </span>

                  <span className="text-slate-300">
                    Projects
                  </span>

                </div>

                <h1 className="text-2xl font-bold">
                  Projects
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and track all your projects.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >
                + New Project
              </button>

            </div>
          </header>

          <div className="px-6 py-8 lg:px-8">

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <SearchIcon />
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search projects..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>

              <select
                value={filterStatus}
                onChange={(event) =>
                  setFilterStatus(event.target.value)
                }
                className="cursor-pointer rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500"
              >
                <option>All Projects</option>
                <option>In Progress</option>
                <option>Planning</option>
                <option>Completed</option>
              </select>

            </div>

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  All Projects
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Loading projects..."
                    : `${filteredProjects.length} projects in your workspace`}
                </p>
              </div>
            </div>

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-10 text-center">
                <p className="text-slate-400">
                  Loading projects...
                </p>
              </div>
            )}

            {!loading &&
              filteredProjects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <FolderIcon />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    No projects found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Create your first project to get started.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="mt-5 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    + Create Project
                  </button>

                </div>
              )}

            {!loading &&
              filteredProjects.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex min-h-[360px] flex-col rounded-2xl border border-white/10 bg-slate-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/20"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                          <FolderIcon />
                        </div>

                        <ProjectActions
                          project={project}
                          onUpdated={(updatedProject) => {
                            setProjects((currentProjects) =>
                              currentProjects.map((currentProject) =>
                                currentProject.id === updatedProject.id
                                  ? {
                                      ...currentProject,
                                      ...updatedProject,
                                    }
                                  : currentProject
                              )
                            );
                          }}
                          onDeleted={(projectId) => {
                            setProjects((currentProjects) =>
                              currentProjects.filter(
                                (currentProject) =>
                                  currentProject.id !== projectId
                              )
                            );
                          }}
                        />

                      </div>

                      <div className="mt-5">

                        <h3 className="truncate text-lg font-semibold">
                          {project.name}
                        </h3>

                        <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-500">
                          {project.description ||
                            "No description provided."}
                        </p>

                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${getStatusStyle(
                            project.status
                          )}`}
                        >
                          {formatStatus(project.status)}
                        </span>
                      </div>

                      <div className="mt-6">

                        <div className="mb-2 flex items-center justify-between text-xs">

                          <span className="text-slate-500">
                            Status
                          </span>

                          <span className="font-medium text-slate-300">
                            {formatStatus(project.status)}
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{
                              width: getProgressWidth(
                                project.status
                              ),
                            }}
                          />

                        </div>

                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5">

                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-400 transition hover:gap-2 hover:text-blue-300"
                        >
                          View Project
                          <span aria-hidden="true">
                            <ArrowIcon />
                          </span>
                        </Link>

                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[10px] font-semibold"
                          title="Muhammad Salman"
                        >
                          MS
                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              )}

          </div>

        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Create New Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new project to your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="cursor-pointer rounded-lg px-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <CloseIcon />
              </button>

            </div>

            <form
              onSubmit={handleCreateProject}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Project Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Website Redesign"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe your project..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="PLANNING">
                    Planning
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}
