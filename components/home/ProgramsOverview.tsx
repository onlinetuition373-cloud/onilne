import { SectionHeading } from "@/components/SectionHeading";
import { ProgramCard } from "@/components/ProgramCard";
import { ButtonLink } from "@/components/ui/button";
import { media } from "@/lib/media";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const items = [
  {
    ...media.programs.tutoring,
    title: "School Tutoring",
    description: "Curriculum-matched lessons in maths, sciences, and languages, with exam practice built into every term.",
    href: "/services#tutoring",
    tags: ["Grades 6 to 12", "GCSE / IGCSE", "O and A Level", "Matric"],
  },
  {
    ...media.programs.writing,
    title: "Academic Writing Coaching",
    description: "One-to-one coaching on research, structure, and referencing so students write stronger work themselves.",
    href: "/services#writing",
    tags: ["College", "Undergraduate", "Postgraduate"],
  },
  {
    ...media.programs.quran,
    title: "Quran and Islamic Studies",
    description: "Qaida to Hifz with certified teachers, one-to-one, at times that suit families anywhere in the world.",
    href: "/services#quran",
    tags: ["Tajweed", "Hifz", "Tafseer", "Kids"],
  },
];

export function ProgramsOverview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          title="Three programs, one standard of teaching"
          description="Every teacher passes a subject test and a demo class before they meet a student."
        />
        <ButtonLink href="/services" variant="secondary" className="self-start md:self-auto">
          See program details
        </ButtonLink>
      </Reveal>
      <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((s) => (
          <StaggerItem key={s.title}>
            <ProgramCard image={s.src} {...s} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
