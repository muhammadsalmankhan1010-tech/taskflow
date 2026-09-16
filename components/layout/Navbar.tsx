
"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  async function fetchNotifications() {
    try {
      setLoadingNotifications(true);

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
      setLoadingNotifications(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  function formatNotificationDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
          T
        </div>

        <span className="font-bold text-gray-900">
          TaskFlow
        </span>
      </div>

      {/* Desktop Title */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-900">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="text-gray-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

            <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400">
              /
            </span>
          </div>
        </div>

        {/* Notification */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((current) => !current);

              if (!showNotifications) {
                fetchNotifications();
              }
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
            aria-label="Notifications"
          >
            🔔

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Notifications
                  </h3>

                  <p className="text-xs text-gray-500">
                    {unreadCount} unread
                  </p>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-gray-100 px-4 py-3 last:border-b-0 ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-indigo-50/50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatNotificationDate(
                              notification.createdAt
                            )}
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

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          MS
        </div>
      </div>
    </header>
  );
}

