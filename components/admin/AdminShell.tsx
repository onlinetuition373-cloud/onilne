"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserPlus, GraduationCap, Wallet, Mail, Menu, X, LogOut, ExternalLink, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { useAdmin } from "./AdminStore";
import { Avatar } from "./ui";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { metrics } = useAdmin();

  useEffect(() => setOpen(false), [pathname]);

  const nav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/admissions", label: "Admissions", icon: UserPlus, count: metrics.newAdmissions },
    { href: "/admin/teachers", label: "Teachers", icon: GraduationCap, count: metrics.teacherAppsToReview },
    { href: "/admin/fees", label: "Fees", icon: Wallet, count: metrics.proofsToVerify },
    { href: "/admin/messages", label: "Messages", icon: Mail, count: metrics.unreadMessages },
  ];

  const totalAlerts = metrics.newAdmissions + metrics.teacherAppsToReview + metrics.proofsToVerify + metrics.unreadMessages;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo href="/admin" suffix="Admin" />
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Admin">
        {nav.map(({ href, label, icon: Icon, count, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-sky-100 hover:text-ink"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{label}</span>
              {!!count && (
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums", active ? "bg-white/20 text-white" : "bg-brand-100 text-brand-700")}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-0.5 border-t border-line p-3">
        <Link href="/" target="_blank" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink-soft hover:bg-sky-100">
          <ExternalLink className="h-[18px] w-[18px]" /> View website
        </Link>
        <Link href="/admin/login" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink-soft hover:bg-sky-100">
          <LogOut className="h-[18px] w-[18px]" /> Sign out
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3.5 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted">
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="hidden text-sm text-ink-muted sm:block">
              Showing sample data. Connect the backend in <code className="rounded bg-sky-100 px-1.5 py-0.5 text-xs text-ink-soft">lib/admin/repository.ts</code>
            </p>
          </div>
          <Link href="/admin/admissions" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-sky-100" aria-label={`${totalAlerts} items need attention`}>
            <Bell className="h-5 w-5" />
            {totalAlerts > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600" />}
          </Link>
          <div className="flex items-center gap-2.5">
            <Avatar name="Academy Admin" />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-ink">Academy Admin</p>
              <p className="text-xs text-ink-muted">Owner</p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
