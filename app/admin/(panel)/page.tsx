"use client";
import Link from "next/link";
import { Users, Wallet, AlertTriangle, UserPlus, GraduationCap, ArrowRight } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminStore";
import { PageTitle, Panel, StatCard, StatusBadge, Avatar, EmptyState } from "@/components/admin/ui";
import { BarList, ColumnChart, Donut, PairedColumnChart } from "@/components/admin/charts";
import { date, invoiceStatus, isLate, money, monthLabel, outstanding, relative, TODAY } from "@/lib/admin/format";
import { programName } from "@/lib/programs";

export default function AdminOverviewPage() {
  const { data, metrics: m } = useAdmin();

  const overdue = data.invoices
    .filter(isLate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);
  const studentById = new Map(data.students.map((s) => [s.id, s]));
  const recentAdmissions = [...data.admissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);
  const recentTeacherApps = data.teacherApplications.filter((t) => t.status === "new" || t.status === "reviewing").slice(0, 4);

  return (
    <>
      <PageTitle
        title="Overview"
        description={`Academy snapshot for ${date(TODAY.toISOString(), { day: "numeric", month: "long", year: "numeric" })}. Totals shown in USD.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Enrolled students"
          value={String(m.enrolledCount)}
          icon={Users}
          sub={
            <>
              <span className="font-semibold text-success">+{m.newThisMonth}</span> this month, {m.trialCount} on trial
            </>
          }
        />
        <StatCard
          label="Collected this month"
          value={money(m.collectedThisMonth, "USD", true)}
          icon={Wallet}
          tone="success"
          sub={`${Math.round(m.collectionRate * 100)}% of ${money(m.billedThisMonth, "USD", true)} billed`}
        />
        <StatCard
          label="Fees outstanding"
          value={money(m.outstandingTotal, "USD", true)}
          icon={AlertTriangle}
          tone="warning"
          sub={`${m.openInvoiceCount} open invoices across ${m.studentsWithDues} students`}
        />
        <StatCard
          label="Overdue"
          value={money(m.overdueTotal, "USD", true)}
          icon={AlertTriangle}
          tone="danger"
          sub={`${m.overdueCount} invoices past due date`}
        />
        <StatCard
          label="Applications to review"
          value={String(m.newAdmissions + m.teacherAppsToReview)}
          icon={UserPlus}
          tone="sky"
          sub={`${m.newAdmissions} students, ${m.teacherAppsToReview} teachers`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="New enrolments by month" className="xl:col-span-2">
          <ColumnChart data={m.enrolmentTrend.map((t) => ({ label: monthLabel(t.period), value: t.value }))} />
        </Panel>
        <Panel title={`Fee status, ${monthLabel(m.enrolmentTrend.at(-1)!.period, true)}`}>
          <Donut
            centerValue={`${Math.round(m.collectionRate * 100)}%`}
            centerLabel="collected"
            segments={[
              { label: "Paid", value: m.feeBreakdown.paid, color: "#5B43DD", display: money(m.feeBreakdown.paid, "USD", true) },
              { label: "Pending", value: m.feeBreakdown.pending, color: "#B5CEFF", display: money(m.feeBreakdown.pending, "USD", true) },
              { label: "Overdue (all months)", value: m.feeBreakdown.overdue, color: "#C2410C", display: money(m.feeBreakdown.overdue, "USD", true) },
            ]}
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Billed vs collected" className="xl:col-span-1">
          <PairedColumnChart
            data={m.collectionTrend.map((t) => ({ label: monthLabel(t.period), a: t.billed, b: t.collected }))}
            format={(v) => money(v, "USD", true)}
          />
        </Panel>
        <Panel title="Enrolled by program">
          <BarList data={m.byProgram} />
          <p className="mt-5 text-xs text-ink-muted">{m.activeTeachers} active teachers</p>
        </Panel>
        <Panel title="Top countries">
          <BarList data={m.byCountry.slice(0, 6)} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Overdue fees"
          bodyClassName="p-0"
          action={
            <Link href="/admin/fees?status=overdue" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
              All overdue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {overdue.length === 0 ? (
            <EmptyState title="No overdue fees" description="Every invoice past its due date has been paid." />
          ) : (
            <ul className="divide-y divide-line">
              {overdue.map((inv) => {
                const s = studentById.get(inv.studentId);
                return (
                  <li key={inv.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={s?.name ?? "?"} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{s?.name}</p>
                      <p className="text-xs text-ink-muted">
                        {monthLabel(inv.period, true)} fee, due {date(inv.dueDate, { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-danger tabular-nums">{money(outstanding(inv), inv.currency)}</p>
                      <StatusBadge status={invoiceStatus(inv)} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Latest student applications"
          bodyClassName="p-0"
          action={
            <Link href="/admin/admissions" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
              Admissions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {recentAdmissions.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={a.studentName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{a.studentName}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {programName(a.program)}, {a.country}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={a.status} />
                  <span className="text-xs text-ink-muted">{relative(a.submittedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Teacher applications waiting"
        bodyClassName="p-0"
        action={
          <Link href="/admin/teachers" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
            Hiring pipeline <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        {recentTeacherApps.length === 0 ? (
          <EmptyState title="All caught up" description="No teacher applications are waiting for review." />
        ) : (
          <ul className="grid grid-cols-1 divide-y divide-line md:grid-cols-2 md:divide-y-0">
            {recentTeacherApps.map((t) => (
              <li key={t.id} className="flex items-center gap-3 border-line px-5 py-3 md:border-b md:odd:border-r">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{t.fullName}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {t.subjects.join(", ")}, {t.experienceYears} yrs, {t.country}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
