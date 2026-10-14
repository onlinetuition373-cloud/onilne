import { z } from "zod";

// Mirrors the future database table: contact_messages
export const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a phone number with country code"),
  country: z.string().min(2, "Select your country"),
  subject: z.string().min(2, "Add a subject"),
  message: z.string().min(10, "Message needs at least 10 characters"),
});
export type ContactInput = z.infer<typeof contactSchema>;

// Mirrors the future database table: payment_proofs
export const paymentProofSchema = z.object({
  name: z.string().min(2, "Enter the student or payer name"),
  email: z.string().email("Enter a valid email address"),
  studentId: z.string().optional(),
  program: z.string().min(1, "Select a program"),
  currency: z.string().min(3, "Select a currency"),
  amountPaid: z.coerce.number({ invalid_type_error: "Enter the amount paid" }).positive("Enter the amount paid"),
  paymentMethod: z.enum(["international-bank", "wise", "paypal", "local"], {
    required_error: "Select a payment method",
  }),
  transactionId: z.string().min(3, "Enter the transaction or reference ID"),
  screenshot: z.any().optional(),
});
export type PaymentProofInput = z.infer<typeof paymentProofSchema>;

// Mirrors the future database table: student_applications
const studentBase = z.object({
  studentType: z.enum(["national", "international"]),
  country: z.string().optional(),
  timezone: z.string().optional(),

  studentName: z.string().min(2, "Enter the student's full name"),
  guardianName: z.string().min(2, "Enter the parent or guardian name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a phone number with country code"),
  whatsapp: z.string().min(7, "Enter a WhatsApp number with country code"),
  city: z.string().min(2, "Enter a city"),
  age: z.coerce.number({ invalid_type_error: "Enter an age" }).min(4, "Minimum age is 4").max(80, "Enter a valid age"),
  gender: z.enum(["male", "female"], { required_error: "Select a gender", invalid_type_error: "Select a gender" }),

  program: z.enum(["tutoring", "writing", "quran"], {
    required_error: "Select a program",
    invalid_type_error: "Select a program",
  }),

  // School Tutoring
  curriculum: z.string().optional(),
  gradeLevel: z.string().optional(),
  subjects: z.array(z.string()).optional(),

  // Academic Writing Coaching
  educationLevel: z.string().optional(),
  writingFocus: z.array(z.string()).optional(),
  instructionsFile: z.any().optional(),

  // Quran and Islamic Studies
  quranCourse: z.string().optional(),

  preferredTeacherGender: z.enum(["male", "female", "no-preference"]).optional(),
  classFormat: z.enum(["one-to-one", "small-group"]).optional(),
  preferredDaysTime: z.string().optional(),

  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Accept the terms to submit your application" }),
  }),
});

type StudentBase = z.infer<typeof studentBase>;

function refineLocation(data: Partial<StudentBase>, ctx: z.RefinementCtx) {
  if (data.studentType === "international") {
    if (!data.country) ctx.addIssue({ code: "custom", path: ["country"], message: "Select your country" });
    if (!data.timezone) ctx.addIssue({ code: "custom", path: ["timezone"], message: "Select your time zone" });
  }
}

function refineProgram(data: Partial<StudentBase>, ctx: z.RefinementCtx) {
  if (data.program === "tutoring") {
    if (!data.curriculum) ctx.addIssue({ code: "custom", path: ["curriculum"], message: "Select a curriculum" });
    if (!data.subjects?.length) ctx.addIssue({ code: "custom", path: ["subjects"], message: "Pick at least one subject" });
  }
  if (data.program === "writing" && !data.educationLevel) {
    ctx.addIssue({ code: "custom", path: ["educationLevel"], message: "Select a level of study" });
  }
  if (data.program === "quran" && !data.quranCourse) {
    ctx.addIssue({ code: "custom", path: ["quranCourse"], message: "Select a course" });
  }
}

export const studentApplicationSchema = studentBase.superRefine((data, ctx) => {
  refineLocation(data, ctx);
  refineProgram(data, ctx);
});
export type StudentApplicationInput = z.infer<typeof studentApplicationSchema>;

// Per-step schemas so conditional rules are checked before the student moves on.
export const studentStepSchemas = {
  1: studentBase.pick({ studentType: true, country: true, timezone: true }).superRefine(refineLocation),
  2: studentBase.pick({
    studentName: true,
    guardianName: true,
    age: true,
    gender: true,
    email: true,
    phone: true,
    whatsapp: true,
    city: true,
  }),
  3: studentBase
    .pick({ program: true, curriculum: true, gradeLevel: true, subjects: true, educationLevel: true, quranCourse: true })
    .superRefine(refineProgram),
} as const;

// Mirrors the future database table: teacher_applications
export const teacherApplicationSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a phone number with country code"),
  whatsapp: z.string().min(7, "Enter a WhatsApp number with country code"),
  gender: z.enum(["male", "female"], { required_error: "Select a gender", invalid_type_error: "Select a gender" }),
  country: z.string().min(2, "Select your country"),
  city: z.string().min(2, "Enter a city"),
  timezone: z.string().min(2, "Select your time zone"),

  qualification: z.string().min(2, "Enter your highest qualification"),
  programs: z.array(z.string()).min(1, "Pick at least one program"),
  subjects: z.array(z.string()).min(1, "Pick at least one subject or course"),
  languages: z.array(z.string()).min(1, "Pick at least one language"),
  experienceYears: z.coerce.number({ invalid_type_error: "Enter years of experience" }).min(0).max(60),

  availability: z.string().min(2, "Describe your weekly availability"),
  expectedRate: z.string().min(1, "Enter your expected hourly rate"),
  bio: z.string().min(40, "Write at least 40 characters about your teaching"),
  cvFile: z.any().optional(),
  demoVideoLink: z.string().url("Enter a full link starting with https://").optional().or(z.literal("")),

  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Accept the terms to submit your application" }),
  }),
});
export type TeacherApplicationInput = z.infer<typeof teacherApplicationSchema>;

export const teacherStepSchemas = {
  1: teacherApplicationSchema.pick({
    fullName: true,
    email: true,
    phone: true,
    whatsapp: true,
    gender: true,
    country: true,
    city: true,
    timezone: true,
  }),
  2: teacherApplicationSchema.pick({
    qualification: true,
    programs: true,
    subjects: true,
    languages: true,
    experienceYears: true,
  }),
  3: teacherApplicationSchema.pick({ availability: true, expectedRate: true, bio: true, demoVideoLink: true }),
} as const;
