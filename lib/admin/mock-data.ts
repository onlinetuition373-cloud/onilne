// Seeded mock data so the admin panel looks and behaves like production before the backend exists.
// TODO(backend): delete this file once lib/admin/repository.ts reads from the database.
import type { Currency } from "@/lib/site-config";
import type { ProgramId } from "@/lib/programs";
import { curricula, quranCourses, schoolSubjects, writingLevels } from "@/lib/programs";
import type {
  AdminData,
  ContactMessage,
  Invoice,
  PaymentMethod,
  PaymentProof,
  Student,
  StudentApplication,
  Teacher,
  TeacherApplication,
} from "./types";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20260917);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pad = (n: number, w = 4) => String(n).padStart(w, "0");
const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d, 9)).toISOString();

const regions: { country: string; cities: string[]; timezone: string; currency: Currency; weight: number }[] = [
  { country: "United Kingdom", cities: ["London", "Birmingham", "Manchester", "Bradford"], timezone: "Europe/London", currency: "GBP", weight: 16 },
  { country: "United States", cities: ["Houston", "Chicago", "New Jersey", "Dallas"], timezone: "America/Chicago", currency: "USD", weight: 12 },
  { country: "Canada", cities: ["Toronto", "Mississauga", "Calgary"], timezone: "America/Toronto", currency: "CAD", weight: 11 },
  { country: "United Arab Emirates", cities: ["Dubai", "Abu Dhabi", "Sharjah"], timezone: "Asia/Dubai", currency: "AED", weight: 12 },
  { country: "Saudi Arabia", cities: ["Riyadh", "Jeddah", "Dammam"], timezone: "Asia/Riyadh", currency: "SAR", weight: 8 },
  { country: "Australia", cities: ["Sydney", "Melbourne"], timezone: "Australia/Sydney", currency: "AUD", weight: 5 },
  { country: "Qatar", cities: ["Doha"], timezone: "Asia/Riyadh", currency: "USD", weight: 4 },
  { country: "Germany", cities: ["Berlin", "Frankfurt"], timezone: "Europe/Berlin", currency: "EUR", weight: 3 },
  { country: "Pakistan", cities: ["Lahore", "Multan", "Karachi", "Islamabad"], timezone: "Asia/Karachi", currency: "PKR", weight: 12 },
];
const weighted = regions.flatMap((r) => Array(r.weight).fill(r)) as typeof regions;

const firstM = ["Ahmed", "Yusuf", "Ibrahim", "Zayan", "Hamza", "Ali", "Rayyan", "Musa", "Omar", "Adam", "Hassan", "Bilal", "Daniyal", "Arham"];
const firstF = ["Aisha", "Maryam", "Hania", "Zainab", "Inaya", "Fatima", "Sara", "Hoorain", "Amna", "Eman", "Noor", "Khadija", "Alizeh", "Mahnoor"];
const last = ["Khan", "Malik", "Qureshi", "Sheikh", "Butt", "Chaudhry", "Rahman", "Siddiqui", "Hussain", "Raza", "Ansari", "Farooq", "Iqbal", "Mirza"];
const parentsF = ["Sadia", "Hina", "Rabia", "Nadia", "Farah", "Uzma", "Saima", "Ayesha"];
const parentsM = ["Imran", "Kashif", "Faisal", "Tariq", "Asif", "Naveed", "Usman", "Adnan"];

const feeByProgram: Record<ProgramId, Partial<Record<Currency, [number, number]>>> = {
  tutoring: { USD: [120, 220], GBP: [100, 180], CAD: [160, 280], AED: [450, 800], SAR: [450, 800], AUD: [180, 320], EUR: [110, 200], PKR: [9000, 18000] },
  writing: { USD: [150, 260], GBP: [120, 220], CAD: [200, 340], AED: [550, 950], SAR: [550, 950], AUD: [220, 380], EUR: [140, 240], PKR: [12000, 22000] },
  quran: { USD: [60, 110], GBP: [50, 90], CAD: [80, 140], AED: [220, 400], SAR: [220, 400], AUD: [90, 160], EUR: [55, 100], PKR: [5000, 9000] },
};
const roundFee = (n: number, c: Currency) => (c === "PKR" ? Math.round(n / 500) * 500 : Math.round(n / 5) * 5);

// Teachers
const teacherSeeds: [string, "male" | "female", ProgramId[], string[], string][] = [
  ["Sana Malik", "female", ["tutoring"], ["Mathematics", "Physics"], "Pakistan"],
  ["Hamza Tariq", "male", ["tutoring"], ["Physics", "Chemistry"], "Pakistan"],
  ["Qari Abdullah Rahman", "male", ["quran"], ["Tajweed", "Hifz"], "Pakistan"],
  ["Ustadha Maryam Iqbal", "female", ["quran"], ["Noorani Qaida", "Nazra Quran", "Tajweed"], "Pakistan"],
  ["Dr. Farah Siddiqui", "female", ["writing"], ["Research and sourcing", "Referencing (APA, Harvard, MLA)"], "United Kingdom"],
  ["Usman Farooq", "male", ["tutoring"], ["Computer Science", "Mathematics"], "United Arab Emirates"],
  ["Hina Qureshi", "female", ["tutoring", "writing"], ["English Language", "English Literature", "Essay planning and structure"], "Canada"],
  ["Qari Bilal Ansari", "male", ["quran"], ["Hifz", "Translation and Tafseer"], "Pakistan"],
  ["Nadia Raza", "female", ["tutoring"], ["Biology", "Chemistry"], "Pakistan"],
  ["Adnan Mirza", "male", ["writing"], ["Essay planning and structure", "Draft feedback"], "Pakistan"],
  ["Ustadha Khadija Butt", "female", ["quran"], ["Islamic Studies for kids", "Noorani Qaida"], "Pakistan"],
  ["Faisal Chaudhry", "male", ["tutoring"], ["Economics", "Business Studies"], "Pakistan"],
];
export const teachers: Teacher[] = teacherSeeds.map(([name, gender, programs, subjects, country], i) => ({
  id: `TCH-${pad(i + 1, 3)}`,
  name,
  gender,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@alfajracademy.com`,
  country,
  programs,
  subjects,
  hourlyRate: country === "Pakistan" ? `USD ${between(8, 14)}` : `USD ${between(18, 30)}`,
  joinedAt: iso(between(2021, 2025), between(1, 12), between(1, 28)),
  status: i === 9 ? "on-leave" : "active",
}));

function detailFor(program: ProgramId, country: string) {
  if (program === "tutoring") {
    if (country === "Pakistan") return "Pakistan: Matric / FSc (all boards)";
    if (country === "United States" || country === "Canada") return pick(["American: Middle and High School", "Canadian provincial", "IB: MYP / DP"]);
    if (country === "Australia") return "Australian curriculum";
    return pick(curricula.slice(0, 5));
  }
  if (program === "writing") return pick(writingLevels.slice(1));
  return pick(quranCourses);
}

// Students: enrolments spread from Jan 2026 to mid Sep 2026, growing over time
const enrolMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const perMonth = [4, 5, 5, 7, 6, 8, 9, 11, 7];
export const students: Student[] = [];
let sIdx = 1040;
enrolMonths.forEach((month, mi) => {
  for (let k = 0; k < perMonth[mi]; k++) {
    const region = pick(weighted);
    const gender = rand() > 0.5 ? "female" : "male";
    const program: ProgramId = pick(["tutoring", "tutoring", "tutoring", "quran", "quran", "writing"]);
    const [lo, hi] = feeByProgram[program][region.currency]!;
    const teacherPool = teachers.filter((t) => t.programs.includes(program));
    const day = month === 9 ? between(1, 15) : between(1, 28);
    const status =
      month === 9 && rand() > 0.45 ? "trial" : rand() > 0.9 ? "paused" : month < 5 && rand() > 0.85 ? "withdrawn" : "active";
    const age = program === "writing" ? between(17, 26) : program === "quran" ? between(6, 15) : between(11, 17);
    sIdx++;
    const name = `${pick(gender === "female" ? firstF : firstM)} ${pick(last)}`;
    students.push({
      id: `STU-${sIdx}`,
      name,
      guardian: program === "writing" ? name : `${pick(rand() > 0.5 ? parentsF : parentsM)} ${name.split(" ")[1]}`,
      email: `${name.toLowerCase().replace(" ", ".")}${between(1, 99)}@gmail.com`,
      phone: region.country === "Pakistan" ? `+92 3${between(0, 4)}${between(0, 9)} ${between(1000000, 9999999)}` : `+${between(1, 971)} ${between(100, 999)} ${between(1000000, 9999999)}`,
      gender,
      age,
      country: region.country,
      city: pick(region.cities),
      timezone: region.timezone,
      program,
      detail: detailFor(program, region.country),
      subjects: program === "tutoring" ? [pick(schoolSubjects.slice(0, 6)), pick(schoolSubjects)].filter((v, i, a) => a.indexOf(v) === i) : [],
      teacherId: pick(teacherPool).id,
      status,
      enrolledAt: iso(2026, month, day),
      monthlyFee: roundFee(between(lo, hi), region.currency),
      currency: region.currency,
    });
  }
});

// Invoices: one per month from enrolment month, due on the 20th.
const methods: PaymentMethod[] = ["international-bank", "wise", "paypal"];
export const invoices: Invoice[] = [];
let invIdx = 3100;
for (const s of students) {
  const startMonth = new Date(s.enrolledAt).getUTCMonth() + 1;
  const endMonth = s.status === "withdrawn" ? Math.min(startMonth + 2, 8) : 9;
  for (let m = Math.max(startMonth, 4); m <= endMonth; m++) {
    invIdx++;
    const isCurrent = m === 9;
    const r = rand();
    let paidAmount = s.monthlyFee;
    let paidAt: string | null = iso(2026, m, between(3, 19));
    if (isCurrent) {
      if (r < 0.42) {
        paidAmount = 0;
        paidAt = null;
      } else if (r < 0.52) {
        paidAmount = roundFee(s.monthlyFee * 0.5, s.currency);
      }
    } else if (m === 8 && r < 0.14) {
      paidAmount = 0;
      paidAt = null;
    } else if (m === 8 && r < 0.2) {
      paidAmount = roundFee(s.monthlyFee * 0.5, s.currency);
    } else if (m === 7 && r < 0.05) {
      paidAmount = 0;
      paidAt = null;
    }
    if (s.status === "trial" && isCurrent) {
      paidAmount = 0;
      paidAt = null;
    }
    if (paidAt && new Date(paidAt) > new Date("2026-09-17")) paidAt = iso(2026, 9, between(1, 16));
    invoices.push({
      id: `INV-${invIdx}`,
      studentId: s.id,
      period: `2026-${String(m).padStart(2, "0")}`,
      amount: s.monthlyFee,
      paidAmount,
      currency: s.currency,
      issuedAt: iso(2026, m, 1),
      dueDate: iso(2026, m, 20),
      paidAt: paidAmount > 0 ? paidAt : null,
      method: paidAmount > 0 ? (s.country === "Pakistan" ? "local" : pick(methods)) : null,
    });
  }
}

// Payment proofs waiting for verification (families who paid but are not yet reconciled)
const unpaid = invoices.filter((i) => i.paidAmount === 0 && i.period === "2026-09");
export const proofs: PaymentProof[] = unpaid.slice(0, 5).map((inv, i) => {
  const s = students.find((st) => st.id === inv.studentId)!;
  return {
    id: `PAY-${pad(880 + i, 4)}`,
    invoiceId: inv.id,
    studentId: s.id,
    payerName: s.guardian,
    email: s.email,
    amount: inv.amount,
    currency: inv.currency,
    method: s.country === "Pakistan" ? "local" : pick(methods),
    transactionId: `${pick(["TRX", "WISE", "PP", "FT"])}${between(10000000, 99999999)}`,
    submittedAt: iso(2026, 9, between(12, 17)),
    status: "pending",
  };
});
proofs.push({
  id: "PAY-0879",
  invoiceId: null,
  studentId: null,
  payerName: "Rabia Hussain",
  email: "rabia.hussain@outlook.com",
  amount: 95,
  currency: "GBP",
  method: "wise",
  transactionId: "WISE55120931",
  submittedAt: iso(2026, 9, 16),
  status: "pending",
});

// Student applications (admissions pipeline)
const admissionStatuses: StudentApplication["status"][] = ["new", "new", "new", "new", "new", "contacted", "contacted", "contacted", "assessment", "assessment", "rejected"];
export const admissions: StudentApplication[] = admissionStatuses.map((status, i) => {
  const region = pick(weighted);
  const gender = rand() > 0.5 ? "female" : "male";
  const program: ProgramId = pick(["tutoring", "tutoring", "quran", "quran", "writing"]);
  const name = `${pick(gender === "female" ? firstF : firstM)} ${pick(last)}`;
  return {
    id: `APP-${pad(2210 + i)}`,
    studentName: name,
    guardianName: `${pick(rand() > 0.5 ? parentsF : parentsM)} ${name.split(" ")[1]}`,
    email: `${name.split(" ")[1].toLowerCase()}.family${between(1, 90)}@gmail.com`,
    phone: `+${between(1, 971)} ${between(100, 999)} ${between(1000000, 9999999)}`,
    gender,
    age: program === "writing" ? between(17, 24) : between(7, 16),
    country: region.country,
    city: pick(region.cities),
    timezone: region.timezone,
    program,
    detail: detailFor(program, region.country),
    subjects: program === "tutoring" ? [pick(schoolSubjects.slice(0, 5))] : [],
    preferredTeacherGender: pick(["no-preference", "female", "male"]),
    preferredDaysTime: pick(["Weekdays after 5 PM", "Weekends mornings", "Mon, Wed, Fri evenings", "Saturday and Sunday 10 AM"]),
    submittedAt: iso(2026, 9, Math.max(17 - i * 1 - (status === "new" ? 0 : 3), 1)),
    status,
  };
});

// Teacher applications (hiring pipeline)
const tSeeds: [string, "male" | "female", string, string, ProgramId[], string[], number, TeacherApplication["status"]][] = [
  ["Zainab Hussain", "female", "United Kingdom", "London", ["tutoring"], ["Chemistry", "Biology"], 6, "new"],
  ["Muhammad Arslan", "male", "Pakistan", "Lahore", ["tutoring"], ["Mathematics", "Physics"], 4, "new"],
  ["Hafiza Amna Sheikh", "female", "Pakistan", "Multan", ["quran"], ["Hifz", "Tajweed"], 7, "new"],
  ["Omar Siddiqui", "male", "Canada", "Toronto", ["writing"], ["Research and sourcing", "Draft feedback"], 5, "new"],
  ["Saima Rehman", "female", "United Arab Emirates", "Dubai", ["tutoring", "writing"], ["English Language", "Essay planning and structure"], 9, "reviewing"],
  ["Qari Yusuf Malik", "male", "Pakistan", "Karachi", ["quran"], ["Nazra Quran", "Tajweed"], 11, "reviewing"],
  ["Mahnoor Iqbal", "female", "Pakistan", "Islamabad", ["tutoring"], ["Computer Science"], 3, "demo"],
  ["Daniyal Khan", "male", "Saudi Arabia", "Riyadh", ["tutoring"], ["Mathematics"], 8, "demo"],
  ["Eman Qureshi", "female", "Pakistan", "Lahore", ["quran"], ["Noorani Qaida", "Islamic Studies for kids"], 2, "approved"],
  ["Tariq Mahmood", "male", "Pakistan", "Faisalabad", ["tutoring"], ["Urdu", "Pakistan Studies"], 1, "rejected"],
];
export const teacherApplications: TeacherApplication[] = tSeeds.map(
  ([fullName, gender, country, city, programs, subjects, exp, status], i) => ({
    id: `TAP-${pad(510 + i, 4)}`,
    fullName,
    email: `${fullName.toLowerCase().replace(/[^a-z]+/g, ".")}@gmail.com`,
    phone: country === "Pakistan" ? `+92 3${between(0, 4)}${between(0, 9)} ${between(1000000, 9999999)}` : `+${between(1, 971)} ${between(100, 999)} ${between(1000000, 9999999)}`,
    gender,
    country,
    city,
    timezone: regions.find((r) => r.country === country)?.timezone ?? "Asia/Karachi",
    qualification: programs.includes("quran")
      ? pick(["Ijazah in Hifz", "Shahadat ul Aalamiya, Ijazah in Tajweed", "Wifaq ul Madaris certified"])
      : pick(["MSc Mathematics", "MPhil Chemistry", "BS Computer Science", "MA English Literature", "PGCE, BSc Biology", "PhD Education"]),
    programs,
    subjects,
    languages: country === "Pakistan" ? ["English", "Urdu"] : pick([["English"], ["English", "Urdu"], ["English", "Arabic"]]),
    experienceYears: exp,
    expectedRate: country === "Pakistan" ? `USD ${between(8, 14)}` : `USD ${between(18, 32)}`,
    availability: pick(["Mon to Fri, 16:00 to 22:00", "Weekends, 09:00 to 17:00", "Daily, 06:00 to 12:00", "Tue, Thu, Sat evenings"]),
    bio: `${exp} years teaching ${subjects.join(" and ")}. Comfortable with online whiteboards and working with students across time zones. Focus on building confidence and exam technique.`,
    demoVideoLink: i % 3 === 0 ? "" : "https://youtu.be/example-demo",
    cvFileName: i % 4 === 3 ? null : `${fullName.split(" ")[0]}_CV.pdf`,
    submittedAt: iso(2026, 9, Math.max(17 - i * 2, 1)),
    status,
  })
);

export const messages: ContactMessage[] = [
  { id: "MSG-1201", name: "Farah Ahmed", email: "farah.ahmed@gmail.com", phone: "+1 647 555 0192", country: "Canada", subject: "Female Tajweed teacher for two kids", message: "Assalamu alaikum, I have two daughters aged 8 and 11 in Toronto. Do you have a female teacher available on weekday evenings after 6 PM Eastern?", receivedAt: iso(2026, 9, 17), read: false },
  { id: "MSG-1200", name: "James Carter", email: "j.carter@outlook.com", phone: "+44 7700 900441", country: "United Kingdom", subject: "IGCSE Maths before mocks", message: "My son sits IGCSE Maths (Edexcel) next summer and mocks are in January. Can you offer two sessions a week?", receivedAt: iso(2026, 9, 16), read: false },
  { id: "MSG-1199", name: "Noor Fatima", email: "noorf@hotmail.com", phone: "+971 50 555 1234", country: "United Arab Emirates", subject: "Change class time", message: "Our school timings changed. Can we move Zayan's classes from 4 PM to 6 PM Dubai time starting next week?", receivedAt: iso(2026, 9, 15), read: true },
  { id: "MSG-1198", name: "Ahmed Raza", email: "ahmed.raza@gmail.com", phone: "+966 55 555 7788", country: "Saudi Arabia", subject: "Invoice in SAR", message: "Is it possible to receive the fee plan in SAR instead of USD?", receivedAt: iso(2026, 9, 13), read: true },
  { id: "MSG-1197", name: "Sophia Lee", email: "sophia.lee@unimelb.edu", phone: "+61 400 555 010", country: "Australia", subject: "Referencing coaching", message: "I am a Masters student and struggle with Harvard referencing and structuring a literature review. Do you offer short packages?", receivedAt: iso(2026, 9, 10), read: true },
];

export function buildMockData(): AdminData {
  // Return fresh copies so UI mutations never touch the module-level arrays.
  return structuredClone({ teachers, students, invoices, proofs, admissions, teacherApplications, messages });
}
