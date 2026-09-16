"use client";

import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    icon: "▦",
  },
  {
    name: "Projects",
    icon: "📁",
  },
  {
    name: "My Tasks",
    icon: "✓",
  },
  {
    name: "Team",
    icon: "👥",
  },
];

const secondaryNavigation = [
  {
    name: "Settings",
    icon: "⚙",
  },
  {
    name: "Help & Support",
    icon: "?",
  },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-100 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            T
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              TaskFlow
            </h1>

            <p className="text-xs text-gray-500">
              Manage smarter
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                active === item.name
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="w-5 text-center text-base">
                {item.icon}
              </span>

              {item.name}
            </button>
          ))}
        </div>

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          More
        </p>

        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                active === item.name
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="w-5 text-center">
                {item.icon}
              </span>

              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            MS
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              Muhammad Salman
            </p>

            <p className="truncate text-xs text-gray-500">
              Free Plan
            </p>
          </div>

          <button className="text-gray-400 hover:text-gray-600">
            ⋮
          </button>
        </div>
      </div>
    </aside>
  );
}