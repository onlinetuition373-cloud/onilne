import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, Target, BookOpenCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { media } from "@/lib/media";
import { siteConfig } from "@/lib/site-config";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { FeatureCard } from "@/components/FeatureCard";

export const metadata: Metadata = {
  title: "About",
  description: `The story, standards, and teachers behind ${siteConfig.academyName}.`,
};

const values = [
  { icon: HeartHandshake, title: "Care first", desc: "Every student is known by name, and every parent knows who to message.", image: media.features.care },
  { icon: Target, title: "Measured progress", desc: "Goals are set at the assessment call and reviewed in every monthly report.", image: media.features.progress },
  { icon: BookOpenCheck, title: "Rooted learning", desc: "Academic and Quran education taught with the same seriousness and warmth.", image: media.features.rooted },
];

const teachers = [
  { name: "Sana Malik", subject: "Mathematics, IGCSE and A Level", qualification: "MPhil Mathematics, 10 years teaching", photo: media.teachers[0] },
  { name: "Hamza Tariq", subject: "Physics, O Level and GCSE", qualification: "MSc Physics, 8 years teaching", photo: media.teachers[1] },
  { name: "Qari Abdullah", subject: "Quran and Tajweed", qualification: "Ijazah in Qira'at, 12 years teaching", photo: media.teachers[2] },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        image={media.pageHeaders.about}
        title={`About ${siteConfig.academyName}`}
        description="A team of teachers and coordinators helping families abroad give their children strong academic and Islamic education."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal from="left" className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-sky-100 shadow-soft">
              <Image src={media.about.story.src} alt={media.about.story.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="absolute -bottom-6 -right-2 rounded-2xl border border-line bg-white px-5 py-4 shadow-soft sm:-right-6">
              <p className="font-heading text-3xl font-bold text-brand-600">{siteConfig.stats[3].value}+ years</p>
              <p className="text-sm text-ink-muted">Teaching families worldwide</p>
            </div>
          </Reveal>
          <Reveal from="right">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Started by teachers who kept getting asked for help
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              {siteConfig.academyName} began in Multan as a small group of tutors helping local students with school subjects
              and Quran memorization. Families who had moved abroad started asking for the same teachers online, and
              university students overseas asked for help with academic writing.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Today we teach students across {siteConfig.stats[2].value} countries. The approach has not changed: qualified
              teachers, honest progress updates, and schedules that fit real family life in any time zone.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sky-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading title="What guides our teaching" />
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <FeatureCard key={v.title} {...v} />
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <SectionHeading title="Some of the teachers your child will learn from" />
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {teachers.map((t) => (
            <StaggerItem
              key={t.name}
              className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sky-100">
                <Image
                  src={t.photo.src}
                  alt={t.photo.alt}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-ink">{t.name}</h3>
                <p className="text-sm font-medium text-brand-700">{t.subject}</p>
                <p className="mt-1 text-sm text-ink-muted">{t.qualification}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <Reveal className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-8 shadow-soft sm:p-10 lg:flex-row lg:items-center">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <h2 className="relative max-w-xl font-heading text-3xl font-bold text-white">Ready to start learning with us?</h2>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/apply/student" variant="light" size="lg">
              Apply as a student
            </ButtonLink>
            <ButtonLink href="/apply/teacher" size="lg" className="border border-white/40 bg-transparent shadow-none hover:bg-white/10">
              Apply to teach
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
