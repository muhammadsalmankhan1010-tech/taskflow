import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            Task<span className="text-blue-500">Flow</span>
          </Link>

          <h1 className="mt-8 text-2xl font-bold">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
          <form className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-500 transition hover:text-blue-400"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 transition hover:text-slate-300"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}