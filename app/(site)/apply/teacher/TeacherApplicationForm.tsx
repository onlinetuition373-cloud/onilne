"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { Input, Select, Textarea, Field, ChipGroup, FieldError, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormStepper } from "@/components/FormStepper";
import { media } from "@/lib/media";
import { ApplicationShell, ApplicationSuccess, ReviewList } from "@/components/apply/ApplicationShell";
import { teacherApplicationSchema, teacherStepSchemas, type TeacherApplicationInput } from "@/lib/schemas";
import { submitTeacherApplication } from "@/lib/submissions";
import { uploadFile } from "@/lib/uploads";
import { validateStep } from "@/lib/forms";
import { countries, programs, quranCourses, schoolSubjects, teachingLanguages, timeZones, writingSupport } from "@/lib/programs";

const steps = ["Basic info", "Teaching", "Availability", "Review"];

export function TeacherApplicationForm() {
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
  } = useForm<TeacherApplicationInput>({
    resolver: zodResolver(teacherApplicationSchema),
    defaultValues: { programs: [], subjects: [], languages: ["English"] },
  });

  const selectedPrograms = watch("programs") ?? [];
  const subjectOptions = [
    ...(selectedPrograms.includes("School Tutoring") ? schoolSubjects : []),
    ...(selectedPrograms.includes("Academic Writing Coaching") ? writingSupport : []),
    ...(selectedPrograms.includes("Quran and Islamic Studies") ? quranCourses : []),
  ];

  function next() {
    const schema = teacherStepSchemas[step as 1 | 2 | 3];
    if (validateStep(schema, getValues(), setError, clearErrors)) {
      setStep((s) => Math.min(s + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function onProgramsChange(next: string[]) {
    setValue("programs", next);
    // Drop subjects that belong to a program the teacher just unselected.
    const allowed = new Set([
      ...(next.includes("School Tutoring") ? schoolSubjects : []),
      ...(next.includes("Academic Writing Coaching") ? writingSupport : []),
      ...(next.includes("Quran and Islamic Studies") ? quranCourses : []),
    ]);
    setValue("subjects", (getValues("subjects") ?? []).filter((s) => allowed.has(s)));
  }

  async function onSubmit(data: TeacherApplicationInput) {
    const cvList = data.cvFile as FileList | undefined;
    if (cvList && cvList.length > 0) await uploadFile(cvList[0], "teacher-cvs");
    const result = await submitTeacherApplication(data);
    if (result.success) setReference(result.id);
  }

  if (reference) {
    return (
      <ApplicationSuccess
        title="Application received"
        message="Thank you for applying to teach with us. Our academic team reviews every profile and replies within five working days."
        reference={reference}
      />
    );
  }

  return (
    <ApplicationShell
      image={media.pageHeaders.applyTeacher}
      title="Teach with us"
      description="Teach students in the UK, North America, the Gulf, and beyond, from home, on hours you choose."
      aside={{
        title: "How hiring works",
        points: [
          "Profile review by our academic team within five working days.",
          "A short subject test for your chosen programs.",
          "A 20 minute demo class with a coordinator.",
          "Onboarding, then your first student match.",
        ],
      }}
    >
      <FormStepper steps={steps} current={step} />
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
                  <Input id="fullName" autoComplete="name" aria-invalid={!!errors.fullName} {...register("fullName")} />
                </Field>
                <Field label="Email" htmlFor="email" error={errors.email?.message}>
                  <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Phone" htmlFor="phone" error={errors.phone?.message} hint="Include your country code">
                  <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
                </Field>
                <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.message}>
                  <Input id="whatsapp" type="tel" aria-invalid={!!errors.whatsapp} {...register("whatsapp")} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Gender" htmlFor="gender" error={errors.gender?.message}>
                  <Select id="gender" defaultValue="" aria-invalid={!!errors.gender} {...register("gender")}>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </Field>
                <Field label="Country" htmlFor="country" error={errors.country?.message}>
                  <Select id="country" defaultValue="" aria-invalid={!!errors.country} {...register("country")}>
                    <option value="" disabled>
                      Select a country
                    </option>
                    {countries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="City" htmlFor="city" error={errors.city?.message}>
                  <Input id="city" aria-invalid={!!errors.city} {...register("city")} />
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Highest qualification" htmlFor="qualification" error={errors.qualification?.message}>
                  <Input id="qualification" placeholder="MSc Physics, Ijazah in Hifz" aria-invalid={!!errors.qualification} {...register("qualification")} />
                </Field>
                <Field label="Years of teaching experience" htmlFor="experienceYears" error={errors.experienceYears?.message}>
                  <Input id="experienceYears" type="number" inputMode="numeric" aria-invalid={!!errors.experienceYears} {...register("experienceYears")} />
                </Field>
              </div>
              <div id="programs">
                <Label>Programs you can teach</Label>
                <ChipGroup label="Programs" options={programs.map((p) => p.name)} value={selectedPrograms} onChange={onProgramsChange} />
                <FieldError message={errors.programs?.message as string | undefined} />
              </div>
              <div id="subjects">
                <Label>Subjects and courses</Label>
                {subjectOptions.length ? (
                  <ChipGroup label="Subjects" options={subjectOptions} value={watch("subjects") ?? []} onChange={(v) => setValue("subjects", v)} />
                ) : (
                  <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-ink-muted">Pick a program above to see its subjects.</p>
                )}
                <FieldError message={errors.subjects?.message as string | undefined} />
              </div>
              <div id="languages">
                <Label>Languages you teach in</Label>
                <ChipGroup label="Languages" options={teachingLanguages} value={watch("languages") ?? []} onChange={(v) => setValue("languages", v)} />
                <FieldError message={errors.languages?.message as string | undefined} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Weekly availability" htmlFor="availability" error={errors.availability?.message} hint="Days and hours in your own time zone">
                  <Input id="availability" placeholder="Mon to Fri, 16:00 to 22:00" aria-invalid={!!errors.availability} {...register("availability")} />
                </Field>
                <Field label="Expected hourly rate" htmlFor="expectedRate" error={errors.expectedRate?.message} hint="Any currency, for example USD 12">
                  <Input id="expectedRate" aria-invalid={!!errors.expectedRate} {...register("expectedRate")} />
                </Field>
              </div>
              <Field label="About your teaching" htmlFor="bio" error={errors.bio?.message}>
                <Textarea id="bio" placeholder="Curricula you know well, age groups, results you are proud of" aria-invalid={!!errors.bio} {...register("bio")} />
              </Field>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="CV (PDF)" htmlFor="cvFile">
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-white p-3">
                    <Upload className="h-5 w-5 text-brand-600" />
                    <input id="cvFile" type="file" accept=".pdf" {...register("cvFile")} className="w-full text-sm text-ink-muted" />
                  </div>
                </Field>
                <Field label="Demo video link (optional)" htmlFor="demoVideoLink" error={errors.demoVideoLink?.message}>
                  <Input id="demoVideoLink" type="url" placeholder="https://" aria-invalid={!!errors.demoVideoLink} {...register("demoVideoLink")} />
                </Field>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <p className="text-ink-muted">Check your details, then submit your application.</p>
              <ReviewList
                rows={[
                  { label: "Name", value: watch("fullName") },
                  { label: "Location", value: `${watch("city")}, ${watch("country")}` },
                  { label: "Contact", value: `${watch("email")}, ${watch("phone")}` },
                  { label: "Qualification", value: watch("qualification") },
                  { label: "Experience", value: `${watch("experienceYears")} years` },
                  { label: "Programs", value: selectedPrograms.join(", ") },
                  { label: "Subjects", value: (watch("subjects") ?? []).join(", ") },
                  { label: "Languages", value: (watch("languages") ?? []).join(", ") },
                  { label: "Availability", value: watch("availability") },
                  { label: "Expected rate", value: watch("expectedRate") },
                ]}
              />
              <label className="flex items-start gap-3 text-sm text-ink-soft">
                <input type="checkbox" id="termsAccepted" className="mt-0.5 h-4 w-4 accent-brand-600" {...register("termsAccepted")} />
                I agree to the academy&apos;s terms, consent to a background check, and confirm these details are correct.
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
