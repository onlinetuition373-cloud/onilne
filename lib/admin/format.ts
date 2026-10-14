import type { Currency } from "@/lib/site-config";
import type { Invoice, InvoiceStatus } from "./types";

// The admin panel reports totals in one base currency.
export const BASE_CURRENCY: Currency = "USD";

// Indicative rates to USD. TODO(backend): load daily rates from an FX rates source.
export const FX_TO_USD: Record<Currency, number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.09,
  CAD: 0.73,
  AUD: 0.66,
  AED: 0.2723,
  SAR: 0.2667,
  PKR: 0.0036,
};

// Fixed "today" keeps mock data stable. TODO(backend): replace with new Date() once data is live.
export const TODAY = new Date("2026-09-17T09:00:00Z");

export const toBase = (amount: number, currency: Currency) => amount * FX_TO_USD[currency];

export function money(amount: number, currency: Currency = BASE_CURRENCY, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "PKR" || compact ? 0 : 2,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}

export function date(iso: string | null, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(iso));
}

export function monthLabel(period: string, withYear = false) {
  const [y, m] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: withYear ? "numeric" : undefined, timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 1))
  );
}

export function relative(iso: string) {
  const diff = Math.round((TODAY.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} wk ago`;
  return date(iso);
}

export function invoiceStatus(inv: Invoice): InvoiceStatus {
  if (inv.paidAmount >= inv.amount) return "paid";
  if (new Date(inv.dueDate) < TODAY) return inv.paidAmount > 0 ? "partial" : "overdue";
  return inv.paidAmount > 0 ? "partial" : "pending";
}

export const outstanding = (inv: Invoice) => Math.max(inv.amount - inv.paidAmount, 0);

export const currentPeriod = () => TODAY.toISOString().slice(0, 7);

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

// True when money is still owed after the due date (fully unpaid or part-paid).
export const isLate = (inv: Invoice) => inv.paidAmount < inv.amount && new Date(inv.dueDate) < TODAY;
