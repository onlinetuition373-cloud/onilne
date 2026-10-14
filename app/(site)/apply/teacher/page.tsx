import type { Metadata } from "next";
import { TeacherApplicationForm } from "./TeacherApplicationForm";

export const metadata: Metadata = {
  title: "Teach with us",
  description: "Apply to teach school subjects, academic writing, or Quran online to students around the world.",
};

export default function ApplyTeacherPage() {
  return <TeacherApplicationForm />;
}
