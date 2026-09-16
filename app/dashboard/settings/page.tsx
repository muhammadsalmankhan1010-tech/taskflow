
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";
import UserMenu from "@/components/auth/UserMenu";
import ChangePasswordForm from "@/components/setting/ChangePasswordForm";
import ProfileForm from "@/components/setting/ProfileForm";
import NotificationPreferences from "@/components/setting/NotificationPreferences";



export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const initials = user.name
        .split(" ")
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="flex min-h-screen">

                {/* Sidebar */}
                <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900 lg:block">
                    <div className="flex h-full flex-col">

                        {/* Logo */}
                        <div className="border-b border-white/10 px-6 py-6">
                            <Link href="/" className="text-2xl font-bold">
                                Task<span className="text-blue-500">Flow</span>
                            </Link>

                            <p className="mt-1 text-xs text-slate-500">
                                Workspace management
                            </p>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2 px-4 py-6">

                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <span className="text-base">âŒ‚</span>
                                Dashboard
                            </Link>

                            <Link
                                href="/dashboard/projects"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <span className="text-base">â–£</span>
                                Projects
                            </Link>

                            <Link
                                href="/dashboard/tasks"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <span className="text-base">âœ“</span>
                                Tasks
                            </Link>

                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium"
                            >
                                <span className="text-base">âš™</span>
                                Settings
                            </Link>
                        </nav>

                        {/* Sidebar User */}
                        <div className="border-t border-white/10 p-4">
                            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                                    {initials}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {user.name}
                                    </p>

                                    <p className="truncate text-xs text-slate-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <section className="min-w-0 flex-1">

                    {/* Topbar */}
                    <header className="flex min-h-20 items-center justify-between border-b border-white/10 bg-slate-950 px-6 lg:px-8">
                        <div>
                            <h1 className="text-xl font-semibold">
                                Settings
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your account and workspace preferences
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <UserMenu
                                name={user.name}
                                email={user.email}
                            />
                        </div>
                    </header>

                    {/* Settings Content */}
                    <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

                        {/* Page Heading */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                Account Settings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Update your personal information, security and preferences.
                            </p>
                        </div>

                        <div className="space-y-6">

                            {/* Profile Card */}
                            <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                                <div className="border-b border-white/10 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-400">
                                            ðŸ‘¤
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Profile Information
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Your basic account information
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                                        {/* Avatar */}
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
                                            {initials}
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="text-lg font-semibold">
                                                {user.name}
                                            </h4>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {user.email}
                                            </p>

                                            <p className="mt-3 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                                TaskFlow Account
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <ProfileForm
                                            initialName={user.name}
                                            initialEmail={user.email}
                                        />
                                    </div>


                                </div>
                            </section>

                            {/* Security */}
                            <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                                <div className="border-b border-white/10 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-lg text-emerald-400">
                                            ðŸ”’
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Security
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Protect your TaskFlow account
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-white/10">

                                    {/* Password */}
                                    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium">
                                                Password
                                            </h4>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Change your account password regularly for better security.
                                            </p>
                                        </div>

                                        <ChangePasswordForm />
                                    </div>

                                    {/* Sessions */}
                                    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium">
                                                Active Sessions
                                            </h4>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Manage devices currently signed into your account.
                                            </p>
                                        </div>

                                        <Link
                                            href="/dashboard/settings/sessions"
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                                        >
                                            Manage Sessions
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* Notifications */}
                            <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                                <div className="border-b border-white/10 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-lg text-purple-400">
                                            ðŸ””
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Notifications
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Control how TaskFlow keeps you informed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <NotificationPreferences />

                                        <div className="flex h-6 w-11 shrink-0 items-center rounded-full bg-blue-600 p-1">
                                            <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 px-6 py-5">
                                        <div>
                                            <h4 className="text-sm font-medium">
                                                Project Activity
                                            </h4>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Get updates about project activity.
                                            </p>
                                        </div>

                                        <div className="flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-700 p-1">
                                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 px-6 py-5">
                                        <div>
                                            <h4 className="text-sm font-medium">
                                                Email Notifications
                                            </h4>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Receive important account notifications by email.
                                            </p>
                                        </div>

                                        <div className="flex h-6 w-11 shrink-0 items-center rounded-full bg-blue-600 p-1">
                                            <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/5">
                                <div className="border-b border-red-500/10 px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-lg text-red-400">
                                            âš 
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-red-400">
                                                Danger Zone
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Actions that affect your current session
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium">
                                            Sign out of TaskFlow
                                        </h4>

                                        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                                            Sign out from your current TaskFlow session. You can
                                            sign back in at any time.
                                        </p>
                                    </div>

                                    <div className="sm:w-auto">
                                        <LogoutButton />
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="py-8 text-center text-xs text-slate-600">
                            TaskFlow â€¢ Account Settings
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}




