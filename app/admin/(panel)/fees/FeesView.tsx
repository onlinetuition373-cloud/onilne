"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Plus, Wallet, AlertTriangle, Clock, FileCheck2, BellRing } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminStore";
import {
  Avatar,
  DetailRow,
  DetailSection,
  Drawer,
  EmptyState,
  FilterSelect,
  PageTitle,
  Panel,
  SearchInput,
  StatCard,
  StatusBadge,
  Table,
  Tabs,
  Td,
  Th,
  Toolbar,
  Tr,
} from "@/components/admin/ui";
import { RecordPayment, methodLabels } from "@/components/admin/RecordPayment";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/admin/csv";
import { TODAY, currentPeriod, date, invoiceStatus, isLate, money, monthLabel, outstanding, relative } from "@/lib/admin/format";
import { programName } from "@/lib/programs";
import { siteConfig, type Currency } from "@/lib/site-config";

function NewInvoiceForm({ onDone }: { onDone: () => void }) {
  const { data, createInvoice } = useAdmin();
  const billable = data.students.filter((s) => s.status !== "withdrawn").sort((a, b) => a.name.localeCompare(b.name));
  const [studentId, setStudentId] = useState(billable[0]?.id ?? "");
  const student = billable.find((s) => s.id === studentId);
  const [period, setPeriod] = useState(currentPeriod());
  const [amount, setAmount] = useState(String(student?.monthlyFee ?? ""));
  const [currency, setCurrency] = useState<Currency>(student?.currency ?? "USD");
  const due = new Date(TODAY);
  due.setUTCDate(due.getUTCDate() + 7);
  const [dueDate, setDueDate] = useState(due.toISOString().slice(0, 10));

  const field = "mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-brand-400 focus:outline-none";

  return (
    <form
      id="new-invoice"
      onSubmit={(e) => {
        e.preventDefault();
        if (!studentId || !(Number(amount) > 0)) return;
        createInvoice({ studentId, period, amount: Number(amount), currency, dueDate });
        onDone();
      }}
      className="space-y-4"
    >
      <label className="block text-sm text-ink-muted">
        Student
        <select
          className={field}
          value={studentId}
          onChange={(e) => {
            const s = billable.find((x) => x.id === e.target.value);
            setStudentId(e.target.value);
            if (s) {
              setAmount(String(s.monthlyFee));
              setCurrency(s.currency);
            }
          }}
        >
          {billable.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.id}), {programName(s.program)}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm text-ink-muted">
          Billing month
          <input type="month" className={field} value={period} onChange={(e) => setPeriod(e.target.value)} required />
        </label>
        <label className="block text-sm text-ink-muted">
          Due date
          <input type="date" className={field} value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </label>
        <label className="block text-sm text-ink-muted">
          Amount
          <input type="number" min="0" step="0.01" className={field} value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        <label className="block text-sm text-ink-muted">
          Currency
          <select className={field} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            {siteConfig.currencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}

export function FeesView() {
  const { data, metrics: m, reviewProof, sendReminder } = useAdmin();
  const params = useSearchParams();
  const [tab, setTab] = useState<"invoices" | "proofs">("invoices");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(params.get("status") ?? "open");
  const [period, setPeriod] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const studentById = useMemo(() => new Map(data.students.map((s) => [s.id, s])), [data.students]);
  const periods = useMemo(() => Array.from(new Set(data.invoices.map((i) => i.period))).sort().reverse(), [data.invoices]);

  const outstandingByCurrency = useMemo(() => {
    const acc: Partial<Record<Currency, number>> = {};
    for (const inv of data.invoices) {
      const o = outstanding(inv);
      if (o > 0) acc[inv.currency] = (acc[inv.currency] ?? 0) + o;
    }
    return Object.entries(acc).sort((a, b) => b[1] - a[1]) as [Currency, number][];
  }, [data.invoices]);

  const invoices = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.invoices
      .filter((i) => {
        const st = invoiceStatus(i);
        if (status === "open") return st !== "paid";
        if (status === "overdue") return isLate(i);
        if (status === "all") return true;
        return st === status;
      })
      .filter((i) => period === "all" || i.period === period)
      .filter((i) => currency === "all" || i.currency === currency)
      .filter((i) => {
        if (!term) return true;
        const s = studentById.get(i.studentId);
        return [i.id, s?.name ?? "", s?.guardian ?? "", s?.email ?? ""].some((v) => v.toLowerCase().includes(term));
      })
      .sort((a, b) => (isLate(b) ? 1 : 0) - (isLate(a) ? 1 : 0) || b.period.localeCompare(a.period) || a.dueDate.localeCompare(b.dueDate));
  }, [data.invoices, status, period, currency, q, studentById]);

  const proofs = [...data.proofs].sort((a, b) => (a.status === "pending" ? -1 : 1) - (b.status === "pending" ? -1 : 1) || b.submittedAt.localeCompare(a.submittedAt));
  const selected = data.invoices.find((i) => i.id === selectedId) ?? null;
  const selectedStudent = selected ? studentById.get(selected.studentId) : undefined;

  function exportCsv() {
    downloadCsv(
      "invoices.csv",
      invoices.map((i) => {
        const s = studentById.get(i.studentId);
        return {
          invoice: i.id,
          student_id: i.studentId,
          student: s?.name,
          guardian: s?.guardian,
          email: s?.email,
          month: i.period,
          currency: i.currency,
          amount: i.amount,
          paid: i.paidAmount,
          balance: outstanding(i),
          due_date: i.dueDate.slice(0, 10),
          status: invoiceStatus(i),
        };
      })
    );
  }

  return (
    <>
      <PageTitle
        title="Fees"
        description="Track invoices and payments in every currency. Summary figures are converted to USD at indicative rates."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> New invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={`Collected in ${monthLabel(currentPeriod())}`} value={money(m.collectedThisMonth, "USD", true)} icon={Wallet} tone="success" sub={`${Math.round(m.collectionRate * 100)}% of this month's billing`} />
        <StatCard label="Outstanding" value={money(m.outstandingTotal, "USD", true)} icon={Clock} tone="warning" sub={`${m.openInvoiceCount} open invoices`} />
        <StatCard label="Overdue" value={money(m.overdueTotal, "USD", true)} icon={AlertTriangle} tone="danger" sub={`${m.overdueCount} invoices past due`} />
        <StatCard label="Payment proofs to verify" value={String(m.proofsToVerify)} icon={FileCheck2} tone="brand" sub="Submitted on the Payments page" />
      </div>

      <Panel title="Outstanding by currency" bodyClassName="flex flex-wrap gap-2">
        {outstandingByCurrency.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing outstanding.</p>
        ) : (
          outstandingByCurrency.map(([c, amt]) => (
            <div key={c} className="min-w-[140px] rounded-xl border border-line px-4 py-2.5">
              <p className="text-xs text-ink-muted">{c}</p>
              <p className="font-heading text-lg font-semibold tabular-nums text-ink">{money(amt, c)}</p>
            </div>
          ))
        )}
      </Panel>

      <Panel bodyClassName="p-0">
        <Tabs
          tabs={[
            { value: "invoices", label: "Invoices", count: invoices.length },
            { value: "proofs", label: "Payment proofs", count: m.proofsToVerify },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === "invoices" ? (
          <>
            <Toolbar>
              <SearchInput value={q} onChange={setQ} placeholder="Search student, parent, or invoice" />
              <FilterSelect
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "open", label: "All unpaid" },
                  { value: "overdue", label: "Overdue" },
                  { value: "pending", label: "Pending" },
                  { value: "partial", label: "Part paid" },
                  { value: "paid", label: "Paid" },
                  { value: "all", label: "All invoices" },
                ]}
              />
              <FilterSelect label="Month" value={period} onChange={setPeriod} options={[{ value: "all", label: "All months" }, ...periods.map((p) => ({ value: p, label: monthLabel(p, true) }))]} />
              <FilterSelect label="Currency" value={currency} onChange={setCurrency} options={[{ value: "all", label: "All currencies" }, ...siteConfig.currencies.map((c) => ({ value: c, label: c }))]} />
            </Toolbar>
            {invoices.length === 0 ? (
              <EmptyState title="No invoices match" description="Try another status or month." />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Student</Th>
                    <Th>Invoice</Th>
                    <Th>Month</Th>
                    <Th className="text-right">Amount</Th>
                    <Th className="text-right">Balance</Th>
                    <Th>Due</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const s = studentById.get(inv.studentId);
                    const st = invoiceStatus(inv);
                    const late = isLate(inv);
                    return (
                      <Tr key={inv.id} onClick={() => setSelectedId(inv.id)}>
                        <Td>
                          <div className="flex items-center gap-3">
                            <Avatar name={s?.name ?? "?"} />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink">{s?.name}</p>
                              <p className="text-xs text-ink-muted">{s?.country}</p>
                            </div>
                          </div>
                        </Td>
                        <Td className="text-xs">{inv.id}</Td>
                        <Td>{monthLabel(inv.period, true)}</Td>
                        <Td className="text-right tabular-nums">{money(inv.amount, inv.currency)}</Td>
                        <Td className={`text-right font-semibold tabular-nums ${st === "paid" ? "text-ink-muted" : late ? "text-danger" : "text-ink"}`}>
                          {money(outstanding(inv), inv.currency)}
                        </Td>
                        <Td className={late ? "text-danger" : ""}>{date(inv.dueDate, { day: "numeric", month: "short" })}</Td>
                        <Td>
                          <StatusBadge status={late && st === "partial" ? "overdue" : st} />
                        </Td>
                        <Td className="text-right">
                          {st !== "paid" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sendReminder(inv.id);
                              }}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                            >
                              <BellRing className="h-3.5 w-3.5" /> Remind
                            </button>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </>
        ) : proofs.length === 0 ? (
          <EmptyState title="No payment proofs yet" description="Families submit these on the Payments page after paying." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Payer</Th>
                <Th className="text-right">Amount</Th>
                <Th>Method</Th>
                <Th>Reference</Th>
                <Th>Matched invoice</Th>
                <Th>Submitted</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {proofs.map((p) => {
                const s = p.studentId ? studentById.get(p.studentId) : undefined;
                return (
                  <Tr key={p.id}>
                    <Td>
                      <p className="font-medium text-ink">{p.payerName}</p>
                      <p className="text-xs text-ink-muted">{s ? `for ${s.name}` : p.email}</p>
                    </Td>
                    <Td className="text-right font-semibold tabular-nums text-ink">{money(p.amount, p.currency)}</Td>
                    <Td>{methodLabels[p.method]}</Td>
                    <Td className="font-mono text-xs">{p.transactionId}</Td>
                    <Td>{p.invoiceId ?? <span className="text-warning">Needs matching</span>}</Td>
                    <Td>{relative(p.submittedAt)}</Td>
                    <Td>
                      <StatusBadge status={p.status} />
                    </Td>
                    <Td className="text-right">
                      {p.status === "pending" && (
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="danger" className="h-8 px-2.5 text-xs" onClick={() => reviewProof(p.id, "rejected")}>
                            Reject
                          </Button>
                          <Button size="sm" className="h-8 px-2.5 text-xs shadow-none" onClick={() => reviewProof(p.id, "verified")} disabled={!p.invoiceId} title={p.invoiceId ? undefined : "Match this payment to an invoice first"}>
                            Verify
                          </Button>
                        </div>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.id}, ${monthLabel(selected.period, true)}` : ""}
        subtitle={selected && <StatusBadge status={isLate(selected) ? "overdue" : invoiceStatus(selected)} />}
        footer={
          selected &&
          invoiceStatus(selected) !== "paid" && (
            <Button variant="secondary" size="sm" onClick={() => sendReminder(selected.id)}>
              <BellRing className="h-4 w-4" /> Send reminder
            </Button>
          )
        }
      >
        {selected && (
          <>
            <div className="mb-6 rounded-2xl bg-sky-50 p-5">
              <p className="text-sm text-ink-muted">Balance due</p>
              <p className="font-heading text-3xl font-bold tabular-nums text-ink">{money(outstanding(selected), selected.currency)}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {money(selected.paidAmount, selected.currency)} paid of {money(selected.amount, selected.currency)}
              </p>
              {invoiceStatus(selected) !== "paid" && <RecordPayment invoice={selected} />}
            </div>
            <DetailSection title="Invoice">
              <DetailRow label="Issued">{date(selected.issuedAt)}</DetailRow>
              <DetailRow label="Due">{date(selected.dueDate)}</DetailRow>
              <DetailRow label="Paid on">{selected.paidAt ? date(selected.paidAt) : ""}</DetailRow>
              <DetailRow label="Method">{selected.method ? methodLabels[selected.method] : ""}</DetailRow>
            </DetailSection>
            {selectedStudent && (
              <DetailSection title="Student">
                <DetailRow label="Name">
                  {selectedStudent.name} ({selectedStudent.id})
                </DetailRow>
                <DetailRow label="Parent">{selectedStudent.guardian}</DetailRow>
                <DetailRow label="Email">{selectedStudent.email}</DetailRow>
                <DetailRow label="Program">{programName(selectedStudent.program)}</DetailRow>
                <DetailRow label="Country">{selectedStudent.country}</DetailRow>
              </DetailSection>
            )}
          </>
        )}
      </Drawer>

      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        title="New invoice"
        subtitle="Bill a student for a month or a one-off charge."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" form="new-invoice">
              Create invoice
            </Button>
          </>
        }
      >
        <NewInvoiceForm onDone={() => setCreating(false)} />
      </Drawer>
    </>
  );
}
