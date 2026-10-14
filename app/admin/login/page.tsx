"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO(backend): authenticate the admin, then verify their role
    await new Promise((r) => setTimeout(r, 500));
    router.push("/admin");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo href="/" />
          <h1 className="mt-10 font-heading text-3xl font-bold tracking-tight text-ink">Sign in to admin</h1>
          <p className="mt-2 text-ink-muted">Manage students, fees, admissions, and teacher hiring.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field label="Work email" htmlFor="email">
              <Input id="email" type="email" autoComplete="username" required defaultValue="admin@alfajracademy.com" />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input id="password" type="password" autoComplete="current-password" required defaultValue="demo-password" />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 rounded-lg bg-sky-50 px-3 py-2 text-xs text-ink-muted">
            Preview mode: any credentials open the dashboard until authentication is connected.
          </p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-brand-700 lg:block">
        <div className="bg-dots absolute inset-0 opacity-40 [filter:invert(1)]" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="max-w-md font-heading text-3xl font-semibold leading-snug text-white">
            Every enrolment, invoice, and teacher application in one place.
          </p>
          <p className="mt-4 max-w-md text-brand-100">Fees tracked in eight currencies and reported in USD.</p>
        </div>
      </div>
    </div>
  );
}
