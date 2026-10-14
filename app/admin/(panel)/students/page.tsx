"use client";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
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
  StatusBadge,
  Table,
  TagList,
  Td,
  Th,
  Toolbar,
  Tr,
} from "@/components/admin/ui";
import { RecordPayment } from "@/components/admin/RecordPayment";
import { Button } from "@/components/ui/button";
import { date, invoiceStatus, isLate, money, monthLabel, outstanding, toBase } from "@/lib/admin/format";
import { downloadCsv } from "@/lib/admin/csv";
import { programName, programs, timeZones } from "@/lib/programs";
import type { Student } from "@/lib/admin/types";

export default function StudentsPage() {
  const { data, setStudentStatus } = useAdmin();
  const [q, setQ] = useState("");
  const [program, setProgram] = useState("all");
  const [status, setStatus] = useState("all");
  const [fees, setFees] = useState("all");
  const [country, setCountry] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const teacherById = useMemo(() => new Map(data.teachers.map((t) => [t.id, t])), [data.teachers]);
  const duesByStudent = useMemo(() => {
    const map = new Map<string, { amountBase: number; overdue: boolean; open: number }>();
    for (const inv of data.invoices) {
      const st = invoiceStatus(inv);
      if (st === "paid") continue;
      const cur = map.get(inv.studentId) ?? { amountBase: 0, overdue: false, open: 0 };
      cur.amountBase += toBase(outstanding(inv), inv.currency);
      cur.open += 1;
      if (isLate(inv)) cur.overdue = true;
      map.set(inv.studentId, cur);
    }
    return map;
  }, [data.invoices]);

  const countries = useMemo(() => Array.from(new Set(data.students.map((s) => s.country))).sort(), [data.students]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.students
      .filter((s) => (program === "all" ? true : s.program === program))
      .filter((s) => (status === "all" ? true : s.status === status))
      .filter((s) => (country === "all" ? true : s.country === country))
      .filter((s) => {
        const d = duesByStudent.get(s.id);
        if (fees === "clear") return !d;
        if (fees === "due") return !!d;
        if (fees === "overdue") return !!d?.overdue;
        return true;
      })
      .filter((s) => !term || [s.name, s.guardian, s.email, s.id, s.city].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt));
  }, [data.students, q, program, status, fees, country, duesByStudent]);

  const selected = data.students.find((s) => s.id === selectedId) ?? null;
  const selectedInvoices = selected ? data.invoices.filter((i) => i.studentId === selected.id).sort((a, b) => b.period.localeCompare(a.period)) : [];

  function exportCsv() {
    downloadCsv(
      "students.csv",
      rows.map((s) => ({
        id: s.id,
        name: s.name,
        guardian: s.guardian,
        email: s.email,
        phone: s.phone,
        country: s.country,
        city: s.city,
        program: programName(s.program),
        detail: s.detail,
        teacher: s.teacherId ? teacherById.get(s.teacherId)?.name : "",
        status: s.status,
        enrolled: s.enrolledAt.slice(0, 10),
        monthly_fee: s.monthlyFee,
        currency: s.currency,
        outstanding_usd: Math.round(duesByStudent.get(s.id)?.amountBase ?? 0),
      }))
    );
  }

  return (
    <>
      <PageTitle
        title="Students"
        description={`${data.students.filter((s) => s.status === "active" || s.status === "trial").length} enrolled, ${data.students.length} records in total`}
        actions={
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Panel bodyClassName="p-0">
        <Toolbar>
          <SearchInput value={q} onChange={setQ} placeholder="Search name, email, or ID" />
          <FilterSelect label="Program" value={program} onChange={setProgram} options={[{ value: "all", label: "All programs" }, ...programs.map((p) => ({ value: p.id, label: p.name }))]} />
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "trial", label: "Trial" },
              { value: "paused", label: "Paused" },
              { value: "withdrawn", label: "Withdrawn" },
            ]}
          />
          <FilterSelect
            label="Fees"
            value={fees}
            onChange={setFees}
            options={[
              { value: "all", label: "Any fee status" },
              { value: "due", label: "Has pending fees" },
              { value: "overdue", label: "Has overdue fees" },
              { value: "clear", label: "Fully paid" },
            ]}
          />
          <FilterSelect label="Country" value={country} onChange={setCountry} options={[{ value: "all", label: "All countries" }, ...countries.map((c) => ({ value: c, label: c }))]} />
          <span className="text-sm text-ink-muted sm:ml-auto">{rows.length} shown</span>
        </Toolbar>

        {rows.length === 0 ? (
          <EmptyState title="No students match these filters" description="Clear a filter or search for a different name." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Student</Th>
                <Th>Program</Th>
                <Th>Location</Th>
                <Th>Teacher</Th>
                <Th>Monthly fee</Th>
                <Th>Outstanding</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const dues = duesByStudent.get(s.id);
                return (
                  <Tr key={s.id} onClick={() => setSelectedId(s.id)}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{s.name}</p>
                          <p className="text-xs text-ink-muted">{s.id}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-ink">{programName(s.program)}</p>
                      <p className="max-w-[200px] truncate text-xs text-ink-muted">{s.detail}</p>
                    </Td>
                    <Td>
                      {s.city}, {s.country}
                    </Td>
                    <Td>{s.teacherId ? teacherById.get(s.teacherId)?.name : <span className="text-warning">Unassigned</span>}</Td>
                    <Td className="tabular-nums">{money(s.monthlyFee, s.currency)}</Td>
                    <Td>
                      {dues ? (
                        <span className={dues.overdue ? "font-semibold text-danger" : "font-semibold text-warning"}>{money(dues.amountBase, "USD")}</span>
                      ) : (
                        <span className="text-success">Paid up</span>
                      )}
                    </Td>
                    <Td>
                      <StatusBadge status={s.status} />
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
        onClose={() => {
          setSelectedId(null);
          setPayingId(null);
        }}
        title={selected?.name ?? ""}
        subtitle={
          selected && (
            <span className="flex items-center gap-2">
              {selected.id} <StatusBadge status={selected.status} />
            </span>
          )
        }
        footer={
          selected && (
            <>
              <label className="mr-auto flex items-center gap-2 text-sm text-ink-muted">
                Status
                <select
                  value={selected.status}
                  onChange={(e) => setStudentStatus(selected.id, e.target.value as Student["status"])}
                  className="h-9 rounded-lg border border-line bg-white px-2 text-sm text-ink"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="paused">Paused</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </label>
              <a href={`mailto:${selected.email}`} className="inline-flex h-9 items-center rounded-xl border border-line bg-white px-3.5 text-sm font-semibold text-ink hover:bg-brand-50">
                Email family
              </a>
            </>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Enrolment">
              <DetailRow label="Program">{programName(selected.program)}</DetailRow>
              <DetailRow label="Level or course">{selected.detail}</DetailRow>
              {selected.subjects.length > 0 && (
                <DetailRow label="Subjects">
                  <TagList items={selected.subjects} />
                </DetailRow>
              )}
              <DetailRow label="Teacher">{selected.teacherId ? teacherById.get(selected.teacherId)?.name : "Unassigned"}</DetailRow>
              <DetailRow label="Enrolled">{date(selected.enrolledAt)}</DetailRow>
              <DetailRow label="Monthly fee">{money(selected.monthlyFee, selected.currency)}</DetailRow>
            </DetailSection>
            <DetailSection title="Family and contact">
              <DetailRow label="Parent or guardian">{selected.guardian}</DetailRow>
              <DetailRow label="Email">{selected.email}</DetailRow>
              <DetailRow label="Phone">{selected.phone}</DetailRow>
              <DetailRow label="Location">
                {selected.city}, {selected.country}
              </DetailRow>
              <DetailRow label="Time zone">{timeZones.find((t) => t.value === selected.timezone)?.label ?? selected.timezone}</DetailRow>
              <DetailRow label="Age">{selected.age}</DetailRow>
            </DetailSection>

            <h3 className="mb-2 text-xs font-semibold text-ink-muted">Invoices</h3>
            {selectedInvoices.length === 0 ? (
              <p className="rounded-xl border border-line px-4 py-3 text-sm text-ink-muted">No invoices yet.</p>
            ) : (
              <ul className="space-y-2">
                {selectedInvoices.map((inv) => {
                  const st = invoiceStatus(inv);
                  return (
                    <li key={inv.id} className="rounded-xl border border-line px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">{monthLabel(inv.period, true)}</p>
                          <p className="text-xs text-ink-muted">
                            {inv.id}, due {date(inv.dueDate, { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold tabular-nums text-ink">{money(inv.amount, inv.currency)}</p>
                          <StatusBadge status={st} />
                        </div>
                      </div>
                      {st !== "paid" &&
                        (payingId === inv.id ? (
                          <RecordPayment invoice={inv} onDone={() => setPayingId(null)} />
                        ) : (
                          <button onClick={() => setPayingId(inv.id)} className="mt-2 text-sm font-medium text-brand-700 hover:underline">
                            Record payment of {money(outstanding(inv), inv.currency)}
                          </button>
                        ))}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </Drawer>
    </>
  );
}
