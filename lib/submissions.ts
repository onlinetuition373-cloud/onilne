// Every public form submission goes through this file. Each function is a clearly marked TODO
// for the backend integration. For now it logs the payload and returns a mock success.
// Submissions land in the admin panel tables of the same name once connected.
import type {
  ContactInput,
  PaymentProofInput,
  StudentApplicationInput,
  TeacherApplicationInput,
} from "./schemas";

type SubmissionResult = { success: true; id: string } | { success: false; error: string };

function mockDelay(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// TODO(backend): insert into `student_applications`
export async function submitStudentApplication(data: StudentApplicationInput): Promise<SubmissionResult> {
  console.log("[submitStudentApplication] payload:", data);
  await mockDelay();
  return { success: true, id: mockId("APP") };
}

// TODO(backend): insert into `teacher_applications`
export async function submitTeacherApplication(data: TeacherApplicationInput): Promise<SubmissionResult> {
  console.log("[submitTeacherApplication] payload:", data);
  await mockDelay();
  return { success: true, id: mockId("TCH") };
}

// TODO(backend): insert into `contact_messages`
export async function submitContactMessage(data: ContactInput): Promise<SubmissionResult> {
  console.log("[submitContactMessage] payload:", data);
  await mockDelay();
  return { success: true, id: mockId("MSG") };
}

// TODO(backend): insert into `payment_proofs` and upload the screenshot to file storage
export async function submitPaymentProof(data: PaymentProofInput): Promise<SubmissionResult> {
  console.log("[submitPaymentProof] payload:", data);
  await mockDelay();
  return { success: true, id: mockId("PAY") };
}
