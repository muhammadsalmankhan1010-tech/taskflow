"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Password reset successfully!");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold text-blue-600"
          >
            TaskFlow
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            Create a new password
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your new password below.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password requirements */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password requirements
              </p>

              <ul className="text-sm text-gray-500 space-y-1">
                <li>• At least 8 characters</li>
                <li>• Use a combination of letters and numbers</li>
                <li>• Avoid using an easily guessed password</li>
              </ul>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition"
            >
              Reset Password
            </button>

          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Login
            </Link>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          © 2026 TaskFlow. All rights reserved.
        </p>

      </div>
    </main>
  );
}