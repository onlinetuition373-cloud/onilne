"use client";
import { useMemo, useState } from "react";
import { FileText, PlayCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { date, relative } from "@/lib/admin/format";
import { programName, programs, timeZones } from "@/lib/programs";
import type { TeacherApplicationStatus } from "@/lib/admin/types";

const pipeline: { value: TeacherApplicationStatus; label: string; hint: string }[] = [
  { value: "new", label: "New", hint: "Not opened yet" },
  { value: "reviewing", label: "In review", hint: "Profile and CV check" },
  { value: "demo", label: "Demo class", hint: "Subject test and demo" },
  { value: "approved", label: "Approved", hint: "Added to faculty" },
  { value: "rejected", label: "Declined", hint: "Not progressing" },
];

export default function TeachersPage() {
  const { data, setTeacherApplicationStatus } = useAdmin();
  const [view, setView] = useState<"applications" | "faculty">("applications");
  const [stage, setStage] = useState<TeacherApplicationStatus>("new");
  const [q, setQ] = useState("");
  const [program, setProgram] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of data.teacherApplications) c[t.status] = (c[t.status] ?? 0) + 1;
    return c;
  }, [data.teacherApplications]);

  const studentCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of data.students) if (s.teacherId && (s.status === "active" || s.status === "trial")) m.set(s.teacherId, (m.get(s.teacherId) ?? 0) + 1);
    return m;
  }, [data.students]);

  const term = q.trim().toLowerCase();
  const apps = data.teacherApplications
    .filter((t) => t.status === stage)
    .filter((t) => program === "all" || t.programs.includes(program as never))
    .filter((t) => !term || [t.fullName, t.email, t.country, ...t.subjects].some((v) => v.toLowerCase().includes(term)))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const faculty = data.teachers
    .filter((t) => program === "all" || t.programs.includes(program as never))
    .filter((t) => !term || [t.name, t.email, t.country, ...t.subjects].some((v) => v.toLowerCase().includes(term)));

  const selected = data.teacherApplications.find((t) => t.id === selectedId) ?? null;
  const toReview = (counts.new ?? 0) + (counts.reviewing ?? 0);

  return (
    <>
      <PageTitle title="Teachers" description="Review teacher applications from the website and manage your faculty." />

      <Panel bodyClassName="p-0">
        <Tabs
          tabs={[
            { value: "applications", label: "Applications", count: toReview },
            { value: "faculty", label: "Faculty", count: data.teachers.length },
          ]}
          value={view}
          onChange={setView}
        />

        {view === "applications" && (
          <div className="grid grid-cols-2 gap-2 border-b border-line p-4 sm:grid-cols-5">
            {pipeline.map((p) => (
              <button
                key={p.value}
                onClick={() => setStage(p.value)}
                aria-pressed={stage === p.value}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  stage === p.value ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-200"
                )}
              >
                <span className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-ink">{p.label}</span>
                  <span className="font-heading text-xl font-bold tabular-nums text-ink">{counts[p.value] ?? 0}</span>
                </span>
                <span className="mt-0.5 block text-xs text-ink-muted">{p.hint}</span>
              </button>
            ))}
          </div>
        )}

        <Toolbar>
          <SearchInput value={q} onChange={setQ} placeholder="Search name, subject, or country" />
          <FilterSelect label="Program" value={program} onChange={setProgram} options={[{ value: "all", label: "All programs" }, ...programs.map((p) => ({ value: p.id, label: p.name }))]} />
        </Toolbar>

        {view === "applications" ? (
          apps.length === 0 ? (
            <EmptyState title="No applications in this stage" description="Applications submitted on the Teach with us page start in New." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Applicant</Th>
                  <Th>Teaches</Th>
                  <Th>Experience</Th>
                  <Th>Location</Th>
                  <Th>Expected rate</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody>
                {apps.map((t) => (
                  <Tr key={t.id} onClick={() => setSelectedId(t.id)}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={t.fullName} />
                        <div>
                          <p className="font-medium text-ink">{t.fullName}</p>
                          <p className="text-xs text-ink-muted">{t.qualification}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-ink">{t.programs.map(programName).join(", ")}</p>
                      <p className="max-w-[240px] truncate text-xs text-ink-muted">{t.subjects.join(", ")}</p>
                    </Td>
                    <Td>{t.experienceYears} years</Td>
                    <Td>
                      {t.city}, {t.country}
                    </Td>
                    <Td>{t.expectedRate}/hr</Td>
                    <Td>{relative(t.submittedAt)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )
        ) : faculty.length === 0 ? (
          <EmptyState title="No teachers match" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Teacher</Th>
                <Th>Programs</Th>
                <Th>Subjects</Th>
                <Th>Students</Th>
                <Th>Country</Th>
                <Th>Rate</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((t) => (
                <Tr key={t.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={t.name} />
                      <div>
                        <p className="font-medium text-ink">{t.name}</p>
                        <p className="text-xs text-ink-muted">Joined {date(t.joinedAt, { month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>{t.programs.map(programName).join(", ")}</Td>
                  <Td>
                    <TagList items={t.subjects.slice(0, 3)} />
                  </Td>
                  <Td className="font-semibold tabular-nums text-ink">{studentCount.get(t.id) ?? 0}</Td>
                  <Td>{t.country}</Td>
                  <Td>{t.hourlyRate}/hr</Td>
                  <Td>
                    <StatusBadge status={t.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.fullName ?? ""}
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
              {selected.status !== "rejected" && selected.status !== "approved" && (
                <Button variant="danger" size="sm" className="mr-auto" onClick={() => setTeacherApplicationStatus(selected.id, "rejected")}>
                  Decline
                </Button>
              )}
              {selected.status === "new" && (
                <Button size="sm" onClick={() => setTeacherApplicationStatus(selected.id, "reviewing")}>
                  Start review
                </Button>
              )}
              {selected.status === "reviewing" && (
                <Button size="sm" onClick={() => setTeacherApplicationStatus(selected.id, "demo")}>
                  Invite to demo class
                </Button>
              )}
              {selected.status === "demo" && (
                <Button size="sm" onClick={() => setTeacherApplicationStatus(selected.id, "approved")}>
                  Approve and add to faculty
                </Button>
              )}
              {selected.status === "rejected" && (
                <Button variant="secondary" size="sm" onClick={() => setTeacherApplicationStatus(selected.id, "reviewing")}>
                  Move back to review
                </Button>
              )}
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-2">
              <span
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-semibold",
                  selected.cvFileName ? "text-ink" : "text-ink-muted"
                )}
                title="TODO(backend): link to the uploaded CV"
              >
                <FileText className="h-4 w-4 text-brand-600" /> {selected.cvFileName ?? "No CV uploaded"}
              </span>
              {selected.demoVideoLink ? (
                <a href={selected.demoVideoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink hover:bg-sky-50">
                  <PlayCircle className="h-4 w-4 text-brand-600" /> Watch demo video
                </a>
              ) : (
                <span className="flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm text-ink-muted">No demo video</span>
              )}
            </div>
            <DetailSection title="Teaching">
              <DetailRow label="Qualification">{selected.qualification}</DetailRow>
              <DetailRow label="Experience">{selected.experienceYears} years</DetailRow>
              <DetailRow label="Programs">{selected.programs.map(programName).join(", ")}</DetailRow>
              <DetailRow label="Subjects">
                <TagList items={selected.subjects} />
              </DetailRow>
              <DetailRow label="Languages">{selected.languages.join(", ")}</DetailRow>
              <DetailRow label="Expected rate">{selected.expectedRate} per hour</DetailRow>
              <DetailRow label="Availability">{selected.availability}</DetailRow>
            </DetailSection>
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-semibold text-ink-muted">About their teaching</h3>
              <p className="rounded-xl border border-line px-4 py-3 text-sm leading-relaxed text-ink-soft">{selected.bio}</p>
            </div>
            <DetailSection title="Contact">
              <DetailRow label="Email">{selected.email}</DetailRow>
              <DetailRow label="Phone">{selected.phone}</DetailRow>
              <DetailRow label="Gender">{selected.gender}</DetailRow>
              <DetailRow label="Location">
                {selected.city}, {selected.country}
              </DetailRow>
              <DetailRow label="Time zone">{timeZones.find((t) => t.value === selected.timezone)?.label ?? selected.timezone}</DetailRow>
              <DetailRow label="Applied">{date(selected.submittedAt)}</DetailRow>
            </DetailSection>
          </>
        )}
      </Drawer>
    </>
  );
}
