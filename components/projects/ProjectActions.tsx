"use client";

import { useState } from "react";

type ProjectActionsProps = {
  project: {
    id: number | string;
    name: string;
    description: string | null;
    status: string;
  };
  onUpdated: (project: {
    id: number | string;
    name: string;
    description: string | null;
    status: string;
  }) => void;
  onDeleted: (projectId: number | string) => void;
};

export default function ProjectActions({
  project,
  onUpdated,
  onDeleted,
}: ProjectActionsProps) {
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(
    project.description || ""
  );
  const [status, setStatus] = useState(project.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("Project name is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
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
          data.error || "Failed to update project."
        );
      }

      onUpdated(data);
      setShowEdit(false);
      setOpen(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/projects/${project.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete project."
        );
      }

      onDeleted(project.id);
      setOpen(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          aria-label="Project options"
          onClick={() => setOpen((current) => !current)}
          className="cursor-pointer rounded-lg px-2 py-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
        >
          
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-30 w-40 overflow-hidden rounded-xl border border-white/10 bg-slate-800 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setName(project.name);
                setDescription(project.description || "");
                setStatus(project.status);
                setShowEdit(true);
                setOpen(false);
              }}
              className="block w-full cursor-pointer px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Edit Project
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="block w-full cursor-pointer px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Edit Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your project details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="cursor-pointer rounded-lg px-2 text-xl text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                
              </button>
            </div>

            <div className="mt-6 space-y-5">
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
                  <option value="ACTIVE">Active</option>
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
                  onClick={() => setShowEdit(false)}
                  className="flex-1 cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex-1 cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

