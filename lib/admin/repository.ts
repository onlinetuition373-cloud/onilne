// Data access layer for the admin panel. The UI only talks to these functions.
// Swap each body for a real API call when the backend is ready; the UI does not need to change.
import { buildMockData } from "./mock-data";
import type { AdminData, Invoice, Student, StudentApplication, TeacherApplication } from "./types";

// TODO(backend): run parallel selects on teachers, students, invoices, payment_proofs,
// student_applications, teacher_applications, contact_messages.
export async function loadAdminData(): Promise<AdminData> {
  return buildMockData();
}

// TODO(backend): update student_applications set status = $status where id = $id
export async function updateAdmissionStatus(_id: string, _status: StudentApplication["status"]) {}

// TODO(backend): update teacher_applications set status; on "approved" insert into teachers
export async function updateTeacherApplicationStatus(_id: string, _status: TeacherApplication["status"]) {}

// TODO(backend): insert into students + first invoice in a single transaction
export async function enrollStudent(_student: Student, _firstInvoice: Invoice) {}

// TODO(backend): update invoices set paid_amount, paid_at, method
export async function recordPayment(_invoiceId: string, _amount: number, _method: Invoice["method"]) {}

// TODO(backend): update payment_proofs set status; when verified also call recordPayment
export async function reviewPaymentProof(_proofId: string, _status: "verified" | "rejected") {}

// TODO(backend): insert into invoices
export async function createInvoice(_invoice: Invoice) {}

// TODO(backend): update students set status
export async function updateStudentStatus(_id: string, _status: Student["status"]) {}

// TODO(backend): update contact_messages set read = true
export async function markMessageRead(_id: string) {}

// TODO(backend): send the reminder by email or WhatsApp
export async function sendFeeReminder(_invoiceId: string) {}
