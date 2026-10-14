"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import * as repo from "@/lib/admin/repository";
import { computeMetrics } from "@/lib/admin/metrics";
import { buildMockData } from "@/lib/admin/mock-data";
import { TODAY } from "@/lib/admin/format";
import type { Currency } from "@/lib/site-config";
import type { AdminData, Invoice, PaymentMethod, Student, StudentApplication, TeacherApplication } from "@/lib/admin/types";

type Toast = { id: number; message: string };

interface AdminStore {
  data: AdminData;
  metrics: ReturnType<typeof computeMetrics>;
  toast: (message: string) => void;
  setAdmissionStatus: (id: string, status: StudentApplication["status"]) => void;
  enrollFromApplication: (id: string, input: { monthlyFee: number; currency: Currency; teacherId: string | null; status: Student["status"] }) => void;
  setTeacherApplicationStatus: (id: string, status: TeacherApplication["status"]) => void;
  recordPayment: (invoiceId: string, amount: number, method: PaymentMethod) => void;
  reviewProof: (id: string, status: "verified" | "rejected") => void;
  createInvoice: (input: { studentId: string; period: string; amount: number; currency: Currency; dueDate: string }) => void;
  setStudentStatus: (id: string, status: Student["status"]) => void;
  markMessageRead: (id: string) => void;
  sendReminder: (invoiceId: string) => void;
}

const Ctx = createContext<AdminStore | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  // Seeded data renders instantly; loadAdminData() is where the real fetch will plug in.
  const [data, setData] = useState<AdminData>(() => buildMockData());
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    repo.loadAdminData().then(setData);
  }, []);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const nextId = (prefix: string, list: { id: string }[]) => {
    const max = list.reduce((m, x) => Math.max(m, Number(x.id.split("-")[1]) || 0), 0);
    return `${prefix}-${max + 1}`;
  };

  const store = useMemo<AdminStore>(
    () => ({
      data,
      metrics: computeMetrics(data),
      toast,

      setAdmissionStatus(id, status) {
        setData((d) => ({ ...d, admissions: d.admissions.map((a) => (a.id === id ? { ...a, status } : a)) }));
        repo.updateAdmissionStatus(id, status);
        toast(status === "rejected" ? "Application declined" : "Application updated");
      },

      enrollFromApplication(id, input) {
        setData((d) => {
          const app = d.admissions.find((a) => a.id === id);
          if (!app) return d;
          const studentId = nextId("STU", d.students);
          const today = TODAY.toISOString();
          const period = today.slice(0, 7);
          const student: Student = {
            id: studentId,
            name: app.studentName,
            guardian: app.guardianName,
            email: app.email,
            phone: app.phone,
            gender: app.gender,
            age: app.age,
            country: app.country,
            city: app.city,
            timezone: app.timezone,
            program: app.program,
            detail: app.detail,
            subjects: app.subjects,
            teacherId: input.teacherId,
            status: input.status,
            enrolledAt: today,
            monthlyFee: input.monthlyFee,
            currency: input.currency,
          };
          const due = new Date(TODAY);
          due.setUTCDate(due.getUTCDate() + 7);
          const invoice: Invoice = {
            id: nextId("INV", d.invoices),
            studentId,
            period,
            amount: input.monthlyFee,
            paidAmount: 0,
            currency: input.currency,
            issuedAt: today,
            dueDate: due.toISOString(),
            paidAt: null,
            method: null,
          };
          repo.enrollStudent(student, invoice);
          return {
            ...d,
            students: [student, ...d.students],
            invoices: [invoice, ...d.invoices],
            admissions: d.admissions.map((a) => (a.id === id ? { ...a, status: "enrolled" } : a)),
          };
        });
        toast("Student enrolled and first invoice created");
      },

      setTeacherApplicationStatus(id, status) {
        setData((d) => {
          const app = d.teacherApplications.find((t) => t.id === id);
          let teachers = d.teachers;
          if (app && status === "approved" && !d.teachers.some((t) => t.email === app.email)) {
            teachers = [
              ...d.teachers,
              {
                id: nextId("TCH", d.teachers),
                name: app.fullName,
                email: app.email,
                gender: app.gender,
                country: app.country,
                programs: app.programs,
                subjects: app.subjects,
                hourlyRate: app.expectedRate,
                joinedAt: TODAY.toISOString(),
                status: "active",
              },
            ];
          }
          return { ...d, teachers, teacherApplications: d.teacherApplications.map((t) => (t.id === id ? { ...t, status } : t)) };
        });
        repo.updateTeacherApplicationStatus(id, status);
        toast(
          status === "approved"
            ? "Teacher approved and added to faculty"
            : status === "rejected"
              ? "Application declined"
              : status === "demo"
                ? "Moved to demo class stage"
                : "Moved to review"
        );
      },

      recordPayment(invoiceId, amount, method) {
        setData((d) => ({
          ...d,
          invoices: d.invoices.map((i) =>
            i.id === invoiceId
              ? { ...i, paidAmount: Math.min(i.paidAmount + amount, i.amount), paidAt: TODAY.toISOString(), method }
              : i
          ),
        }));
        repo.recordPayment(invoiceId, amount, method);
        toast("Payment recorded");
      },

      reviewProof(id, status) {
        setData((d) => {
          const proof = d.proofs.find((p) => p.id === id);
          let invoices = d.invoices;
          if (proof && status === "verified" && proof.invoiceId) {
            invoices = d.invoices.map((i) =>
              i.id === proof.invoiceId
                ? { ...i, paidAmount: Math.min(i.paidAmount + proof.amount, i.amount), paidAt: TODAY.toISOString(), method: proof.method }
                : i
            );
          }
          return { ...d, invoices, proofs: d.proofs.map((p) => (p.id === id ? { ...p, status } : p)) };
        });
        repo.reviewPaymentProof(id, status);
        toast(status === "verified" ? "Payment verified and invoice updated" : "Payment proof rejected");
      },

      createInvoice(input) {
        setData((d) => {
          const invoice: Invoice = {
            id: nextId("INV", d.invoices),
            studentId: input.studentId,
            period: input.period,
            amount: input.amount,
            paidAmount: 0,
            currency: input.currency,
            issuedAt: TODAY.toISOString(),
            dueDate: new Date(input.dueDate).toISOString(),
            paidAt: null,
            method: null,
          };
          repo.createInvoice(invoice);
          return { ...d, invoices: [invoice, ...d.invoices] };
        });
        toast("Invoice created");
      },

      setStudentStatus(id, status) {
        setData((d) => ({ ...d, students: d.students.map((s) => (s.id === id ? { ...s, status } : s)) }));
        repo.updateStudentStatus(id, status);
        toast("Student status updated");
      },

      markMessageRead(id) {
        setData((d) => ({ ...d, messages: d.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) }));
        repo.markMessageRead(id);
      },

      sendReminder(invoiceId) {
        repo.sendFeeReminder(invoiceId);
        toast("Fee reminder queued");
      },
    }),
    [data, toast]
  );

  return (
    <Ctx.Provider value={store}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex animate-fade-up items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-soft"
          >
            <CheckCircle2 className="h-4 w-4 text-sky-300" />
            {t.message}
            <button
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              aria-label="Dismiss"
              className="ml-2 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminStoreProvider");
  return ctx;
}
