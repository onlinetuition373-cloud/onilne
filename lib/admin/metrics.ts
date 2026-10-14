import { programs } from "@/lib/programs";
import type { AdminData } from "./types";
import { TODAY, currentPeriod, invoiceStatus, isLate, outstanding, toBase } from "./format";

export function computeMetrics(d: AdminData) {
  const period = currentPeriod();
  const enrolled = d.students.filter((s) => s.status === "active" || s.status === "trial");
  const newThisMonth = d.students.filter((s) => s.enrolledAt.slice(0, 7) === period).length;

  const withStatus = d.invoices.map((inv) => ({ inv, status: invoiceStatus(inv) }));
  const thisMonth = withStatus.filter((x) => x.inv.period === period);

  const collectedThisMonth = d.invoices
    .filter((i) => i.paidAt && i.paidAt.slice(0, 7) === period)
    .reduce((sum, i) => sum + toBase(i.paidAmount, i.currency), 0);
  const billedThisMonth = thisMonth.reduce((sum, x) => sum + toBase(x.inv.amount, x.inv.currency), 0);

  const open = withStatus.filter((x) => x.status !== "paid");
  const outstandingTotal = open.reduce((sum, x) => sum + toBase(outstanding(x.inv), x.inv.currency), 0);
  const overdue = withStatus.filter((x) => isLate(x.inv));
  const overdueTotal = overdue.reduce((sum, x) => sum + toBase(outstanding(x.inv), x.inv.currency), 0);
  const studentsWithDues = new Set(open.map((x) => x.inv.studentId)).size;

  const feeBreakdown = {
    paid: thisMonth.reduce((s, x) => s + toBase(x.inv.paidAmount, x.inv.currency), 0),
    pending: thisMonth.filter((x) => x.status !== "paid" && !isLate(x.inv)).reduce((s, x) => s + toBase(outstanding(x.inv), x.inv.currency), 0),
    overdue: withStatus
      .filter((x) => isLate(x.inv))
      .reduce((s, x) => s + toBase(outstanding(x.inv), x.inv.currency), 0),
  };

  // Enrolments over the last 9 months
  const months: string[] = [];
  for (let i = 8; i >= 0; i--) {
    const dt = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() - i, 1));
    months.push(dt.toISOString().slice(0, 7));
  }
  const enrolmentTrend = months.map((m) => ({ period: m, value: d.students.filter((s) => s.enrolledAt.slice(0, 7) === m).length }));
  const collectionTrend = months.slice(-6).map((m) => ({
    period: m,
    billed: d.invoices.filter((i) => i.period === m).reduce((s, i) => s + toBase(i.amount, i.currency), 0),
    collected: d.invoices.filter((i) => i.period === m).reduce((s, i) => s + toBase(i.paidAmount, i.currency), 0),
  }));

  const byProgram = programs.map((p) => ({ label: p.name, value: enrolled.filter((s) => s.program === p.id).length }));
  const countryCounts = enrolled.reduce<Record<string, number>>((acc, s) => {
    acc[s.country] = (acc[s.country] ?? 0) + 1;
    return acc;
  }, {});
  const byCountry = Object.entries(countryCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return {
    enrolledCount: enrolled.length,
    activeCount: d.students.filter((s) => s.status === "active").length,
    trialCount: d.students.filter((s) => s.status === "trial").length,
    newThisMonth,
    collectedThisMonth,
    billedThisMonth,
    collectionRate: billedThisMonth ? feeBreakdown.paid / billedThisMonth : 0,
    outstandingTotal,
    overdueTotal,
    overdueCount: overdue.length,
    openInvoiceCount: open.length,
    studentsWithDues,
    feeBreakdown,
    enrolmentTrend,
    collectionTrend,
    byProgram,
    byCountry,
    newAdmissions: d.admissions.filter((a) => a.status === "new").length,
    teacherAppsToReview: d.teacherApplications.filter((t) => t.status === "new" || t.status === "reviewing").length,
    proofsToVerify: d.proofs.filter((p) => p.status === "pending").length,
    unreadMessages: d.messages.filter((m) => !m.read).length,
    activeTeachers: d.teachers.filter((t) => t.status === "active").length,
  };
}

export type Metrics = ReturnType<typeof computeMetrics>;
