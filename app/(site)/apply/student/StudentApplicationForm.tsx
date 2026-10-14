"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, BookOpen, PenLine, GraduationCap } from "lucide-react";
import { Input, Select, Field, ChipGroup, FieldError, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormStepper } from "@/components/FormStepper";
import { media } from "@/lib/media";
import { ApplicationShell, ApplicationSuccess, ReviewList } from "@/components/apply/ApplicationShell";
import { studentApplicationSchema, studentStepSchemas, type StudentApplicationInput } from "@/lib/schemas";
import { submitStudentApplication } from "@/lib/submissions";
import { uploadFile } from "@/lib/uploads";
import { validateStep } from "@/lib/forms";
import { cn } from "@/lib/utils";
import {
  countries,
  curricula,
  gradeLevels,
  programName,
  programs,
  quranCourses,
  schoolSubjects,
  timeZones,
  writingLevels,
  writingSupport,
  type ProgramId,
} from "@/lib/programs";

const steps = ["Location", "Student", "Program", "Review"];
const programIcons: Record<ProgramId, typeof BookOpen> = { tutoring: GraduationCap, writing: PenLine, quran: BookOpen };

export function StudentApplicationForm() {
  const params = useSearchParams();
  const initialProgram = programs.find((p) => p.id === params.get("program"))?.id;

  const [step, setStep] = useState(1);
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<StudentApplicationInput>({
    resolver: zodResolver(studentApplicationSchema),
    defaultValues: {
      studentType: "international",
      subjects: [],
      writingFocus: [],
      program: initialProgram,
      preferredTeacherGender: "no-preference",
      classFormat: "one-to-one",
    },
  });

  const studentType = watch("studentType");
  const program = watch("program");

  function next() {
    const schema = studentStepSchemas[step as 1 | 2 | 3];
    if (validateStep(schema, getValues(), setError, clearErrors)) {
      setStep((s) => Math.min(s + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit(data: StudentApplicationInput) {
    const fileList = data.instructionsFile as FileList | undefined;
    if (fileList && fileList.length > 0) await uploadFile(fileList[0], "student-instructions");
    const result = await submitStudentApplication(data);
    if (result.success) setReference(result.id);
  }

  if (reference) {
    return (
      <ApplicationSuccess
        title="Application received"
        message="A coordinator will contact you on WhatsApp or email within one working day to book the free assessment call."
        reference={reference}
      />
    );
  }

  const tz = timeZones.find((t) => t.value === watch("timezone"))?.label;

  return (
    <ApplicationShell
      image={media.pageHeaders.applyStudent}
      title="Apply as a student"
      description="Four short steps. Nothing is charged until you have your assessment call and a written fee plan."
      aside={{
        title: "What happens next",
        points: [
          "A coordinator contacts you within one working day.",
          "A free 20 minute assessment call to understand the student's level.",
          "A teacher match and a fee plan in your currency.",
          "First class usually within a week of applying.",
        ],
      }}
    >
      <FormStepper steps={steps} current={step} />
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label>Where does the student live?</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      { value: "international", title: "Outside Pakistan", desc: "Classes scheduled in your local time zone" },
                      { value: "national", title: "In Pakistan", desc: "Classes in Pakistan Standard Time" },
                    ] as const
                  ).map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      aria-pressed={studentType === opt.value}
                      onClick={() => setValue("studentType", opt.value)}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-colors",
                        studentType === opt.value ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-200"
                      )}
                    >
                      <span className="block font-semibold text-ink">{opt.title}</span>
                      <span className="mt-0.5 block text-sm text-ink-muted">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              {studentType === "international" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Country" htmlFor="country" error={errors.country?.message}>
                    <Select id="country" defaultValue="" aria-invalid={!!errors.country} {...register("country")}>
                      <option value="" disabled>
                        Select a country
                      </option>
                      {countries.filter((c) => c !== "Pakistan").map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Time zone" htmlFor="timezone" error={errors.timezone?.message}>
                    <Select id="timezone" defaultValue="" aria-invalid={!!errors.timezone} {...register("timezone")}>
                      <option value="" disabled>
                        Select a time zone
                      </option>
                      {timeZones.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Student full name" htmlFor="studentName" error={errors.studentName?.message}>
                  <Input id="studentName" aria-invalid={!!errors.studentName} {...register("studentName")} />
                </Field>
                <Field label="Parent or guardian name" htmlFor="guardianName" error={errors.guardianName?.message}>
                  <Input id="guardianName" aria-invalid={!!errors.guardianName} {...register("guardianName")} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Student age" htmlFor="age" error={errors.age?.message}>
                  <Input id="age" type="number" inputMode="numeric" aria-invalid={!!errors.age} {...register("age")} />
                </Field>
                <Field label="Student gender" htmlFor="gender" error={errors.gender?.message}>
                  <Select id="gender" defaultValue="" aria-invalid={!!errors.gender} {...register("gender")}>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Email" htmlFor="email" error={errors.email?.message}>
                  <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                </Field>
                <Field label="City" htmlFor="city" error={errors.city?.message}>
                  <Input id="city" autoComplete="address-level2" aria-invalid={!!errors.city} {...register("city")} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Phone" htmlFor="phone" error={errors.phone?.message} hint="Include country code, for example +1 or +44">
                  <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
                </Field>
                <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.message}>
                  <Input id="whatsapp" type="tel" aria-invalid={!!errors.whatsapp} {...register("whatsapp")} />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Which program?</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {programs.map((p) => {
                    const Icon = programIcons[p.id];
                    const active = program === p.id;
                    return (
                      <button
                        type="button"
                        id={p.id === programs[0].id ? "program" : undefined}
                        key={p.id}
                        aria-pressed={active}
                        onClick={() => setValue("program", p.id)}
                        className={cn(
                          "rounded-xl border-2 p-4 text-left transition-colors",
                          active ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-200"
                        )}
                      >
                        <Icon className="h-5 w-5 text-brand-600" />
                        <span className="mt-2 block font-semibold leading-snug text-ink">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
                <FieldError message={errors.program?.message} />
              </div>

              {program === "tutoring" && (
                <div className="space-y-5 rounded-xl bg-sky-50 p-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Curriculum" htmlFor="curriculum" error={errors.curriculum?.message}>
                      <Select id="curriculum" defaultValue="" aria-invalid={!!errors.curriculum} {...register("curriculum")}>
                        <option value="" disabled>
                          Select a curriculum
                        </option>
                        {curricula.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Grade or year" htmlFor="gradeLevel">
                      <Select id="gradeLevel" defaultValue="" {...register("gradeLevel")}>
                        <option value="">Not sure</option>
                        {gradeLevels.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                  <div id="subjects">
                    <Label>Subjects</Label>
                    <ChipGroup label="Subjects" options={schoolSubjects} value={watch("subjects") ?? []} onChange={(v) => setValue("subjects", v)} />
                    <FieldError message={errors.subjects?.message as string | undefined} />
                  </div>
                </div>
              )}

              {program === "writing" && (
                <div className="space-y-5 rounded-xl bg-sky-50 p-5">
                  <Field label="Level of study" htmlFor="educationLevel" error={errors.educationLevel?.message}>
                    <Select id="educationLevel" defaultValue="" aria-invalid={!!errors.educationLevel} {...register("educationLevel")}>
                      <option value="" disabled>
                        Select a level
                      </option>
                      {writingLevels.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </Select>
                  </Field>
                  <div>
                    <Label>What would you like help with?</Label>
                    <ChipGroup label="Writing focus" options={writingSupport} value={watch("writingFocus") ?? []} onChange={(v) => setValue("writingFocus", v)} />
                  </div>
                  <Field label="Course brief or rubric (optional)" htmlFor="instructionsFile">
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-white p-3">
                      <Upload className="h-5 w-5 text-brand-600" />
                      <input id="instructionsFile" type="file" accept=".pdf,.doc,.docx,image/*" {...register("instructionsFile")} className="w-full text-sm text-ink-muted" />
                    </div>
                  </Field>
                </div>
              )}

              {program === "quran" && (
                <div className="space-y-5 rounded-xl bg-sky-50 p-5">
                  <Field label="Course" htmlFor="quranCourse" error={errors.quranCourse?.message}>
                    <Select id="quranCourse" defaultValue="" aria-invalid={!!errors.quranCourse} {...register("quranCourse")}>
                      <option value="" disabled>
                        Select a course
                      </option>
                      {quranCourses.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
              )}

              {program && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="Teacher preference" htmlFor="preferredTeacherGender">
                    <Select id="preferredTeacherGender" {...register("preferredTeacherGender")}>
                      <option value="no-preference">No preference</option>
                      <option value="female">Female teacher</option>
                      <option value="male">Male teacher</option>
                    </Select>
                  </Field>
                  <Field label="Class format" htmlFor="classFormat">
                    <Select id="classFormat" {...register("classFormat")}>
                      <option value="one-to-one">One-to-one</option>
                      <option value="small-group">Small group</option>
                    </Select>
                  </Field>
                  <Field label="Preferred days and time" htmlFor="preferredDaysTime">
                    <Input id="preferredDaysTime" placeholder="Weekdays after 5 PM" {...register("preferredDaysTime")} />
                  </Field>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <p className="text-ink-muted">Check the details below, then submit your application.</p>
              <ReviewList
                rows={[
                  { label: "Student", value: `${watch("studentName")} (age ${watch("age")})` },
                  { label: "Parent or guardian", value: watch("guardianName") },
                  { label: "Location", value: studentType === "international" ? `${watch("city")}, ${watch("country")}` : `${watch("city")}, Pakistan` },
                  ...(studentType === "international" ? [{ label: "Time zone", value: tz }] : []),
                  { label: "Contact", value: `${watch("email")}, ${watch("phone")}` },
                  { label: "Program", value: program ? programName(program) : undefined },
                  ...(program === "tutoring"
                    ? [
                        { label: "Curriculum", value: watch("curriculum") },
                        { label: "Subjects", value: (watch("subjects") ?? []).join(", ") },
                      ]
                    : []),
                  ...(program === "writing" ? [{ label: "Level", value: watch("educationLevel") }] : []),
                  ...(program === "quran" ? [{ label: "Course", value: watch("quranCourse") }] : []),
                  { label: "Preferred time", value: watch("preferredDaysTime") },
                ]}
              />
              <label className="flex items-start gap-3 text-sm text-ink-soft">
                <input type="checkbox" id="termsAccepted" className="mt-0.5 h-4 w-4 accent-brand-600" {...register("termsAccepted")} />
                I agree to the academy&apos;s terms and privacy policy, and confirm these details are correct.
              </label>
              <FieldError message={errors.termsAccepted?.message} />
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            {step > 1 ? (
              <Button variant="ghost" onClick={back}>
                Back
              </Button>
            ) : (
              <span className="text-sm text-ink-muted">Step 1 of 4</span>
            )}
            {step < 4 ? (
              <Button onClick={next}>Continue</Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit application"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </ApplicationShell>
  );
}
