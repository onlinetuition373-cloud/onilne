"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "./AdminStore";
import { money, outstanding } from "@/lib/admin/format";
import type { Invoice, PaymentMethod } from "@/lib/admin/types";

export const methodLabels: Record<PaymentMethod, string> = {
  "international-bank": "Bank transfer",
  wise: "Wise",
  paypal: "PayPal",
  local: "JazzCash / local bank",
};

// Inline form shared by the student drawer and the fees page.
export function RecordPayment({ invoice, onDone }: { invoice: Invoice; onDone?: () => void }) {
  const { recordPayment } = useAdmin();
  const due = outstanding(invoice);
  const [amount, setAmount] = useState(String(due));
  const [method, setMethod] = useState<PaymentMethod>("international-bank");
  const value = Number(amount);
  const valid = value > 0 && value <= due;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        recordPayment(invoice.id, value, method);
        onDone?.();
      }}
      className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-brand-100 bg-brand-50/60 p-3 sm:grid-cols-[1fr_1fr_auto]"
    >
      <label className="text-xs text-ink-muted">
        Amount ({invoice.currency})
        <input
          type="number"
          step="0.01"
          min="0"
          max={due}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 h-9 w-full rounded-lg border border-line bg-white px-2.5 text-sm text-ink focus:border-brand-400 focus:outline-none"
        />
      </label>
      <label className="text-xs text-ink-muted">
        Method
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          className="mt-1 h-9 w-full rounded-lg border border-line bg-white px-2 text-sm text-ink focus:border-brand-400 focus:outline-none"
        >
          {Object.entries(methodLabels).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <Button type="submit" size="sm" disabled={!valid} className="w-full">
          Save
        </Button>
      </div>
      {!valid && <p className="text-xs text-danger sm:col-span-3">Enter an amount up to {money(due, invoice.currency)}.</p>}
    </form>
  );
}
