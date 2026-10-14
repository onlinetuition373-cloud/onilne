"use client";
import { useEffect, useRef } from "react";
import { Search, X, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/admin/format";

// ---------- Page title ----------
export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

// ---------- Panel ----------
export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="font-heading text-[15px] font-semibold text-ink">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

// ---------- Stat card ----------
export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "brand" | "sky" | "warning" | "danger" | "success";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    sky: "bg-sky-100 text-sky-600",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    success: "bg-success-soft text-success",
  };
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-2 font-heading text-[1.75rem] font-bold leading-none tracking-tight text-ink tabular-nums">{value}</p>
      {sub && <div className="mt-2 text-xs text-ink-muted">{sub}</div>}
    </div>
  );
}

// ---------- Status badge ----------
const badgeTones: Record<string, string> = {
  // students
  active: "bg-success-soft text-success",
  trial: "bg-brand-50 text-brand-700",
  paused: "bg-warning-soft text-warning",
  withdrawn: "bg-slate-100 text-slate-600",
  "on-leave": "bg-warning-soft text-warning",
  // invoices
  paid: "bg-success-soft text-success",
  partial: "bg-sky-100 text-sky-600",
  pending: "bg-warning-soft text-warning",
  overdue: "bg-danger-soft text-danger",
  // admissions / hiring
  new: "bg-brand-50 text-brand-700",
  contacted: "bg-sky-100 text-sky-600",
  assessment: "bg-warning-soft text-warning",
  enrolled: "bg-success-soft text-success",
  reviewing: "bg-sky-100 text-sky-600",
  demo: "bg-warning-soft text-warning",
  approved: "bg-success-soft text-success",
  rejected: "bg-slate-100 text-slate-600",
  verified: "bg-success-soft text-success",
};

export const statusLabels: Record<string, string> = {
  assessment: "Assessment booked",
  demo: "Demo class",
  "on-leave": "On leave",
  reviewing: "In review",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = statusLabels[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", badgeTones[status] ?? "bg-slate-100 text-slate-600", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}

// ---------- Avatar ----------
export function Avatar({ name, className }: { name: string; className?: string }) {
  const palette = ["bg-brand-100 text-brand-800", "bg-sky-200 text-sky-600", "bg-brand-50 text-brand-600", "bg-sky-100 text-ink-soft"];
  const idx = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % palette.length;
  return (
    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold", palette[idx], className)} aria-hidden>
      {initials(name)}
    </span>
  );
}

// ---------- Toolbar controls ----------
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border border-line bg-white px-3 pr-8 text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 border-b border-line p-4 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
}

// ---------- Tabs ----------
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line px-4">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              active ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums", active ? "bg-brand-100 text-brand-700" : "bg-sky-100 text-ink-muted")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Table ----------
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("whitespace-nowrap bg-canvas px-4 py-2.5 text-xs font-semibold text-ink-muted", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle text-ink-soft", className)}>{children}</td>;
}
export function Tr({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <tr
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      className={cn("border-t border-line", onClick && "cursor-pointer hover:bg-sky-50 focus-visible:bg-sky-50 focus-visible:outline-none", className)}
    >
      {children}
    </tr>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-ink-muted">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="mt-3 font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
    </div>
  );
}

// ---------- Drawer ----------
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-lg animate-slide-in flex-col bg-white shadow-2xl focus:outline-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate font-heading text-lg font-semibold text-ink">{title}</h2>
            {subtitle && <div className="mt-1 text-sm text-ink-muted">{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Close panel" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-sky-50 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-line bg-canvas px-6 py-4">{footer}</footer>}
      </div>
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="mb-2 text-xs font-semibold text-ink-muted">{title}</h3>
      <dl className="divide-y divide-line rounded-xl border border-line">{children}</dl>
    </div>
  );
}

export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 gap-3 px-4 py-2.5 text-sm">
      <dt className="col-span-2 text-ink-muted">{label}</dt>
      <dd className="col-span-3 break-words font-medium text-ink">{children || <span className="font-normal text-ink-muted">Not provided</span>}</dd>
    </div>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {items.map((i) => (
        <span key={i} className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-ink-soft">
          {i}
        </span>
      ))}
    </span>
  );
}
