import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { media } from "@/lib/media";
import { Reveal } from "@/components/motion";
import { curricula, quranCourses, schoolSubjects, writingLevels, writingSupport } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Live online school tutoring for international curricula, academic writing coaching, and Quran and Islamic studies.",
};

type Group = { label: string; items: readonly string[] };

function ProgramSection({
  id,
  title,
  image,
  alt,
  intro,
  groups,
  reverse,
  note,
}: {
  id: string;
  title: string;
  image: string;
  alt: string;
  intro: string;
  groups: Group[];
  reverse?: boolean;
  note?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-line py-16 last:border-0 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className={reverse ? "lg:order-2 lg:col-span-5" : "lg:col-span-5"}>
          <Reveal from={reverse ? "right" : "left"} className="lg:sticky lg:top-28">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-sky-100 shadow-soft">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>
        <Reveal className={reverse ? "lg:order-1 lg:col-span-7" : "lg:col-span-7"}>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</p>

          <div className="mt-8 space-y-7">
            {groups.map((g) => (
              <div key={g.label}>
                <h3 className="font-heading text-lg font-semibold text-ink">{g.label}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-ink-soft">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {note && <p className="mt-8 rounded-xl bg-sky-50 p-4 text-sm leading-relaxed text-ink-soft">{note}</p>}

          <ButtonLink href={`/apply/student?program=${id}`} className="mt-8">
            Apply for {title}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        image={media.pageHeaders.services}
        title="Programs"
        description="Three programs taught live online. Fees are shared in a written plan after the free assessment call."
      />

      <ProgramSection
        id="tutoring"
        title="School Tutoring"
        image={media.programs.tutoring.src}
        alt={media.programs.tutoring.alt}
        intro="Lessons follow the student's own school curriculum and exam board, so every class moves them forward on what they are actually being tested on."
        groups={[
          { label: "Curricula", items: curricula.filter((c) => c !== "Other") },
          { label: "Subjects", items: schoolSubjects },
          {
            label: "How classes run",
            items: ["One-to-one or small groups of up to four", "Past-paper practice before exams", "Homework support between classes", "Monthly report for parents"],
          },
        ]}
      />

      <ProgramSection
        id="writing"
        title="Academic Writing Coaching"
        image={media.programs.writing.src}
        alt={media.programs.writing.alt}
        intro="Coaching for students in high school, college, and university who want to research, plan, and write better work on their own."
        reverse
        groups={[
          { label: "Levels", items: writingLevels },
          { label: "What we coach", items: writingSupport },
          {
            label: "How coaching works",
            items: ["Share the brief and your deadline", "Get matched with a subject coach", "Work through your plan and drafts live", "Receive written feedback after each session"],
          },
        ]}
        note="Coaches teach skills and review the student's own drafts. We do not write or submit work on a student's behalf, in line with university academic integrity policies."
      />

      <ProgramSection
        id="quran"
        title="Quran and Islamic Studies"
        image={media.programs.quran.src}
        alt={media.programs.quran.alt}
        intro="One-to-one classes with certified male and female teachers, paced for each student, from first letters to complete Hifz."
        groups={[
          { label: "Courses", items: quranCourses },
          { label: "Teachers", items: ["Ijazah-holding teachers for Hifz and Tajweed", "Male and female teachers", "English, Urdu, and Arabic speaking"] },
          { label: "Scheduling", items: ["Slots in every major time zone", "Weekend classes available", "Short sessions for young learners"] },
        ]}
      />
    </>
  );
}
