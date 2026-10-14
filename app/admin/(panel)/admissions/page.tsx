"use client";
import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
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
  Tabs,
  Td,
  Th,
  Toolbar,
  Tr,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { date, relative } from "@/lib/admin/format";
import { programName, programs, timeZones } from "@/lib/programs";
import { siteConfig, type Currency } from "@/lib/site-config";
import type { AdmissionStatus, Student, StudentApplication } from "@/lib/admin/types";

const stages: { value: AdmissionStatus | "all"; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "assessment", label: "Assessment booked" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Declined" },
  { value: "all", label: "All" },
];

const currencyByCountry: Record<string, Currency> = {
  "United Kingdom": "GBP",
  Canada: "CAD",
  Australia: "AUD",
  "United Arab Emirates": "AED",
  "Saudi Arabia": "SAR",
  Pakistan: "PKR",
  Germany: "EUR",
  Netherlands: "EUR",
  Ireland: "EUR",
};

function EnrollForm({ app, onDone }: { app: StudentApplication; onDone: () => void }) {
  const { data, enrollFromApplication } = useAdmin();
  const eligible = data.teachers.filter(
    (t) => t.status === "active" && t.programs.includes(app.program) && (app.preferredTeacherGender === "no-preference" || t.gender === app.preferredTeacherGender)
  );
  const [fee, setFee] = useState("");
  const [currency, setCurrency] = useState<Currency>(currencyByCountry[app.country] ?? "USD");
  const [teacherId, setTeacherId] = useState(eligible[0]?.id ?? "");
  const [status, setStatus] = useState<Student["status"]>("trial");
  const valid = Number(fee) > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        enrollFromApplication(app.id, { monthlyFee: Number(fee), currency, teacherId: teacherId || null, status });
        onDone();
      }}
      className="rounded-xl border border-brand-200 bg-brand-50/60 p-4"
    >
      <h3 className="font-heading font-semibold text-ink">Enrol {app.studentName}</h3>
      <p className="mt-0.5 text-xs text-ink-muted">Creates the student record and the first invoice, due in 7 days.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-xs text-ink-muted">
          Monthly fee
          <input
            type="number"
            min="0"
            step="1"
            required
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-brand-400 focus:outline-none"
          />
        </label>
        <label className="text-xs text-ink-muted">
          Currency
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm text-ink">
            {siteConfig.currencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="col-span-2 text-xs text-ink-muted">
          Teacher {app.preferredTeacherGender !== "no-preference" && `(family prefers a ${app.preferredTeacherGender} teacher)`}
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm text-ink">
            <option value="">Assign later</option>
            {eligible.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}, {t.subjects.slice(0, 2).join(", ")}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2 text-xs text-ink-muted">
          Start as
          <select value={status} onChange={(e) => setStatus(e.target.value as Student["status"])} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm text-ink">
            <option value="trial">Trial</option>
            <option value="active">Active</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!valid}>
          Confirm enrolment
        </Button>
      </div>
    </form>
  );
}

export default function AdmissionsPage() {
  const { data, setAdmissionStatus } = useAdmin();
  const [stage, setStage] = useState<AdmissionStatus | "all">("new");
  const [q, setQ] = useState("");
  const [program, setProgram] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data.admissions.length };
    for (const a of data.admissions) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [data.admissions]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.admissions
      .filter((a) => stage === "all" || a.status === stage)
      .filter((a) => program === "all" || a.program === program)
      .filter((a) => !term || [a.studentName, a.guardianName, a.email, a.id, a.country].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [data.admissions, stage, program, q]);

  const selected = data.admissions.find((a) => a.id === selectedId) ?? null;
  const close = () => {
    setSelectedId(null);
    setEnrolling(false);
  };

  return (
    <>
      <PageTitle title="Admissions" description="Student applications from the website, from first contact to enrolment." />

      <Panel bodyClassName="p-0">
        <Tabs tabs={stages.map((s) => ({ ...s, count: counts[s.value] ?? 0 }))} value={stage} onChange={setStage} />
        <Toolbar>
          <SearchInput value={q} onChange={setQ} placeholder="Search applicant, email, or country" />
          <FilterSelect label="Program" value={program} onChange={setProgram} options={[{ value: "all", label: "All programs" }, ...programs.map((p) => ({ value: p.id, label: p.name }))]} />
        </Toolbar>
        {rows.length === 0 ? (
          <EmptyState title="No applications here" description="New applications from the website appear in the New tab." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Applicant</Th>
                <Th>Program</Th>
                <Th>Location</Th>
                <Th>Preferred time</Th>
                <Th>Received</Th>
                <Th>Stage</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <Tr key={a.id} onClick={() => setSelectedId(a.id)}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.studentName} />
                      <div>
                        <p className="font-medium text-ink">{a.studentName}</p>
                        <p className="text-xs text-ink-muted">Parent: {a.guardianName}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-ink">{programName(a.program)}</p>
                    <p className="max-w-[220px] truncate text-xs text-ink-muted">{a.detail}</p>
                  </Td>
                  <Td>
                    {a.city}, {a.country}
                  </Td>
                  <Td>{a.preferredDaysTime}</Td>
                  <Td>{relative(a.submittedAt)}</Td>
                  <Td>
                    <StatusBadge status={a.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      <Drawer
        open={!!selected}
        onClose={close}
        title={selected?.studentName ?? ""}
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
              {selected.status !== "rejected" && selected.status !== "enrolled" && (
                <Button variant="danger" size="sm" className="mr-auto" onClick={() => setAdmissionStatus(selected.id, "rejected")}>
                  Decline
                </Button>
              )}
              {selected.status === "rejected" && (
                <Button variant="secondary" size="sm" onClick={() => setAdmissionStatus(selected.id, "new")}>
                  Reopen application
                </Button>
              )}
              {selected.status === "new" && (
                <Button size="sm" onClick={() => setAdmissionStatus(selected.id, "contacted")}>
                  Mark as contacted
                </Button>
              )}
              {selected.status === "contacted" && (
                <Button size="sm" onClick={() => setAdmissionStatus(selected.id, "assessment")}>
                  Assessment booked
                </Button>
              )}
              {selected.status === "assessment" && !enrolling && (
                <Button size="sm" onClick={() => setEnrolling(true)}>
                  Enrol student
                </Button>
              )}
            </>
          )
        }
      >
        {selected && (
          <>
            {enrolling && (
              <div className="mb-6">
                <EnrollForm app={selected} onDone={() => setEnrolling(false)} />
              </div>
            )}
            <a
              href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink hover:bg-sky-50"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Message {selected.guardianName.split(" ")[0]} on WhatsApp
            </a>
            <DetailSection title="Student">
              <DetailRow label="Age and gender">
                {selected.age}, {selected.gender}
              </DetailRow>
              <DetailRow label="Program">{programName(selected.program)}</DetailRow>
              <DetailRow label="Level or course">{selected.detail}</DetailRow>
              {selected.subjects.length > 0 && (
                <DetailRow label="Subjects">
                  <TagList items={selected.subjects} />
                </DetailRow>
              )}
              <DetailRow label="Teacher preference">{selected.preferredTeacherGender === "no-preference" ? "No preference" : `${selected.preferredTeacherGender} teacher`}</DetailRow>
              <DetailRow label="Preferred time">{selected.preferredDaysTime}</DetailRow>
            </DetailSection>
            <DetailSection title="Family">
              <DetailRow label="Parent or guardian">{selected.guardianName}</DetailRow>
              <DetailRow label="Email">{selected.email}</DetailRow>
              <DetailRow label="Phone">{selected.phone}</DetailRow>
              <DetailRow label="Location">
                {selected.city}, {selected.country}
              </DetailRow>
              <DetailRow label="Time zone">{timeZones.find((t) => t.value === selected.timezone)?.label ?? selected.timezone}</DetailRow>
              <DetailRow label="Submitted">{date(selected.submittedAt)}</DetailRow>
            </DetailSection>
          </>
        )}
      </Drawer>
    </>
  );
}
