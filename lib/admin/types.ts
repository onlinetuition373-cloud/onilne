// Admin data model. Each type maps 1:1 to a future database table.
import type { ProgramId } from "@/lib/programs";
import type { Currency } from "@/lib/site-config";

export type StudentStatus = "active" | "trial" | "paused" | "withdrawn";
export type InvoiceStatus = "paid" | "partial" | "pending" | "overdue";
export type AdmissionStatus = "new" | "contacted" | "assessment" | "enrolled" | "rejected";
export type TeacherApplicationStatus = "new" | "reviewing" | "demo" | "approved" | "rejected";
export type ProofStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "international-bank" | "wise" | "paypal" | "local";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female";
  country: string;
  programs: ProgramId[];
  subjects: string[];
  hourlyRate: string;
  joinedAt: string;
  status: "active" | "on-leave";
}

export interface Student {
  id: string;
  name: string;
  guardian: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  age: number;
  country: string;
  city: string;
  timezone: string;
  program: ProgramId;
  detail: string; // curriculum, level, or course
  subjects: string[];
  teacherId: string | null;
  status: StudentStatus;
  enrolledAt: string;
  monthlyFee: number;
  currency: Currency;
}

export interface Invoice {
  id: string;
  studentId: string;
  period: string; // YYYY-MM
  amount: number;
  paidAmount: number;
  currency: Currency;
  issuedAt: string;
  dueDate: string;
  paidAt: string | null;
  method: PaymentMethod | null;
}

export interface PaymentProof {
  id: string;
  invoiceId: string | null;
  studentId: string | null;
  payerName: string;
  email: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  transactionId: string;
  submittedAt: string;
  status: ProofStatus;
}

export interface StudentApplication {
  id: string;
  studentName: string;
  guardianName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  age: number;
  country: string;
  city: string;
  timezone: string;
  program: ProgramId;
  detail: string;
  subjects: string[];
  preferredTeacherGender: "male" | "female" | "no-preference";
  preferredDaysTime: string;
  submittedAt: string;
  status: AdmissionStatus;
}

export interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  country: string;
  city: string;
  timezone: string;
  qualification: string;
  programs: ProgramId[];
  subjects: string[];
  languages: string[];
  experienceYears: number;
  expectedRate: string;
  availability: string;
  bio: string;
  demoVideoLink: string;
  cvFileName: string | null;
  submittedAt: string;
  status: TeacherApplicationStatus;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

export interface AdminData {
  teachers: Teacher[];
  students: Student[];
  invoices: Invoice[];
  proofs: PaymentProof[];
  admissions: StudentApplication[];
  teacherApplications: TeacherApplication[];
  messages: ContactMessage[];
}
