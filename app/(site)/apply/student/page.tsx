import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentApplicationForm } from "./StudentApplicationForm";

export const metadata: Metadata = {
  title: "Apply as a student",
  description: "Apply for live online tutoring, writing coaching, or Quran classes and book a free assessment call.",
};

export default function ApplyStudentPage() {
  return (
    <Suspense>
      <StudentApplicationForm />
    </Suspense>
  );
}
