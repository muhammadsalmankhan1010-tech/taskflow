
"use client";

import { useEffect, useRef, useState } from "react";

type Notification = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      setLoading(true);

      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleToggle() {
    const nextState = !open;

    setOpen(nextState);

    if (nextState) {
      fetchNotifications();
    }
  }

  async function markAllAsRead() {
    try {
      setActionLoading(true);

      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteAllNotifications() {
    if (!window.confirm("Are you sure you want to remove all notifications?")) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch("/api/notifications", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notifications");
      }

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    } finally {
      setActionLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  Notifications
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {unreadCount} unread
                </p>
              </div>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={actionLoading || unreadCount === 0}
                  className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {actionLoading ? "Working..." : "Mark all as read"}
                </button>

                <button
                  type="button"
                  onClick={deleteAllNotifications}
                  disabled={actionLoading}
                  className="cursor-pointer rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove all
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-white/10 px-4 py-4 last:border-b-0 ${
                    notification.isRead
                      ? "bg-slate-900"
                      : "bg-blue-500/5"
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        notification.isRead
                          ? "bg-slate-600"
                          : "bg-blue-500"
                      }`}
                    />

                    <div className="min-w-0">
                      <p className="text-sm leading-5 text-slate-300">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
