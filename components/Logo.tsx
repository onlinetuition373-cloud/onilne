import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// Shared brand mark used by the site navbar, footer, and admin sidebar.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#5B43DD" />
      <path d="M8 21.5c3.2-6.4 12.8-6.4 16 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="11.5" r="3.2" fill="#B5CEFF" />
    </svg>
  );
}

export function Logo({ href = "/", tone = "dark", suffix }: { href?: string; tone?: "dark" | "light"; suffix?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label={`${siteConfig.academyName} home`}>
      <LogoMark />
      <span className={cn("font-heading text-lg font-bold leading-none", tone === "light" ? "text-white" : "text-ink")}>
        {siteConfig.academyName}
        {suffix && <span className="ml-2 align-middle text-xs font-semibold text-brand-600">{suffix}</span>}
      </span>
    </Link>
  );
}
