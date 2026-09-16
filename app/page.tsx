import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Task<span className="text-blue-500">Flow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Simple. Powerful. Productive.
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Manage your work.
            <br />
            <span className="text-blue-500">Flow with productivity.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
            TaskFlow helps individuals and teams organize projects, manage
            tasks, track progress, and stay productive — all in one place.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
            >
              Start for Free
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl shadow-blue-950/30">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="h-4 w-32 rounded bg-slate-700" />
                  <div className="mt-2 h-3 w-48 rounded bg-slate-800" />
                </div>

                <div className="h-9 w-24 rounded-lg bg-blue-600" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Total Projects", "12"],
                  ["Active Tasks", "28"],
                  ["Completed", "84%"],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-white/10 bg-slate-900 p-5 text-left"
                  >
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="h-48 rounded-xl border border-white/10 bg-slate-900 p-5">
                  <div className="h-4 w-28 rounded bg-slate-700" />
                  <div className="mt-6 h-3 w-full rounded bg-slate-800" />
                  <div className="mt-4 h-3 w-4/5 rounded bg-slate-800" />
                  <div className="mt-4 h-3 w-3/5 rounded bg-slate-800" />
                </div>

                <div className="h-48 rounded-xl border border-white/10 bg-slate-900 p-5">
                  <div className="h-4 w-28 rounded bg-slate-700" />
                  <div className="mt-6 h-10 w-10 rounded-full bg-blue-600/30" />
                  <div className="mt-4 h-3 w-full rounded bg-slate-800" />
                  <div className="mt-4 h-3 w-2/3 rounded bg-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Everything you need to stay organized
            </h2>

            <p className="mt-4 text-slate-400">
              TaskFlow gives you the tools to plan, organize, and complete
              your work efficiently.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "✓",
                title: "Task Management",
                description:
                  "Create, organize, prioritize, and track your tasks.",
              },
              {
                icon: "▣",
                title: "Project Management",
                description:
                  "Keep projects organized with clear goals and progress.",
              },
              {
                icon: "◷",
                title: "Progress Tracking",
                description:
                  "Monitor your productivity and project completion.",
              },
              {
                icon: "⚙",
                title: "Simple Workflow",
                description:
                  "A clean workspace designed to keep you focused.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-500">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Get organized in three simple steps
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Create an account",
                text: "Register your TaskFlow account and set up your workspace.",
              },
              {
                number: "02",
                title: "Create projects",
                text: "Add projects and break your goals into manageable tasks.",
              },
              {
                number: "03",
                title: "Get things done",
                text: "Track progress, complete tasks, and improve productivity.",
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold text-blue-500/20">
                  {step.number}
                </span>

                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            Ready to take control of your work?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Start organizing your projects and tasks with TaskFlow today.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-3.5 font-semibold transition hover:bg-blue-500"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>

          <p>Organize. Focus. Accomplish.</p>
        </div>
      </footer>
    </main>
  );
}