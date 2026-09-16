"use client";

import { useEffect, useState } from "react";

type Preferences = {
  taskNotifications: boolean;
  projectNotifications: boolean;
  emailNotifications: boolean;
};

const defaultPreferences: Preferences = {
  taskNotifications: true,
  projectNotifications: false,
  emailNotifications: true,
};

export default function NotificationPreferences() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPreferences() {
      try {
        const response = await fetch("/api/notification-preferences");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load notification preferences."
          );
        }

        setPreferences(data.preferences);
      } catch (error) {
        console.error("Load notification preferences error:", error);
        setError("Unable to load notification preferences.");
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  async function updatePreference(
    key: keyof Preferences,
    value: boolean
  ) {
    const previousPreferences = preferences;

    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };

    setPreferences(updatedPreferences);
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/notification-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPreferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update notification preferences."
        );
      }

      setPreferences(data.preferences);
    } catch (error) {
      console.error("Update notification preferences error:", error);

      setPreferences(previousPreferences);
      setError("Unable to save this preference. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const items = [
    {
      key: "taskNotifications" as const,
      title: "Task Updates",
      description: "Receive notifications when tasks are updated.",
    },
    {
      key: "projectNotifications" as const,
      title: "Project Activity",
      description: "Get updates about project activity.",
    },
    {
      key: "emailNotifications" as const,
      title: "Email Notifications",
      description: "Receive important account notifications by email.",
    },
  ];

  if (loading) {
    return (
      <div className="divide-y divide-white/10">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 px-6 py-5"
          >
            <div>
              <h4 className="text-sm font-medium">{item.title}</h4>
              <p className="mt-1 text-xs text-slate-500">
                {item.description}
              </p>
            </div>

            <div className="h-6 w-11 shrink-0 animate-pulse rounded-full bg-slate-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {items.map((item) => {
        const enabled = preferences[item.key];

        return (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 px-6 py-5"
          >
            <div>
              <h4 className="text-sm font-medium">{item.title}</h4>

              <p className="mt-1 text-xs text-slate-500">
                {item.description}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label={`Toggle ${item.title}`}
              disabled={saving}
              onClick={() => updatePreference(item.key, !enabled)}
              className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${
                enabled ? "bg-blue-600" : "bg-slate-700"
              } ${saving ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <span
                className={`h-4 w-4 rounded-full transition ${
                  enabled
                    ? "ml-auto bg-white"
                    : "ml-0 bg-slate-400"
                }`}
              />
            </button>
          </div>
        );
      })}

      {error && (
        <div className="px-6 py-4 text-xs text-red-400">
          {error}
        </div>
      )}

      {saving && (
        <div className="px-6 py-3 text-xs text-slate-500">
          Saving changes...
        </div>
      )}
    </div>
  );
}
