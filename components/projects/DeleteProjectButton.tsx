
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteProjectButtonProps = {
  projectId: number;
};

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setError("");
    setIsOpen(true);
  }

  function closeDialog() {
    if (!deleting) {
      setIsOpen(false);
      setError("");
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/projects/${projectId}`,
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

      // Return to the projects list after successful deletion.
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      setDeleting(false);
    }
  }

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={openDialog}
        className="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
      >
        Delete
      </button>

      {/* Confirmation Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

            {/* Header */}
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-lg text-red-400">
                  !
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Delete Project?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-slate-400">
                Are you sure you want to delete this project?
                All tasks associated with this project will also
                be permanently deleted.
              </p>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
              <button
                type="button"
                onClick={closeDialog}
                disabled={deleting}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

