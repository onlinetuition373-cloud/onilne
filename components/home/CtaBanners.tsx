import { ArrowRight, GraduationCap, Presentation } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion";

export function CtaBanners() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Reveal
          from="left"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-8 shadow-soft sm:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" />
          <div className="pointer-events-none absolute -bottom-24 right-16 h-48 w-48 rounded-full bg-sky-300/20 blur-2xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h2 className="mt-6 font-heading text-3xl font-bold text-white">Start with a free assessment</h2>
            <p className="mt-3 max-w-md leading-relaxed text-brand-100">
              Tell us about the student. We will call within one working day to plan the right classes.
            </p>
            <ButtonLink href="/apply/student" variant="light" size="lg" className="mt-7">
              Apply as a student <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal
          from="right"
          className="group relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-sky-100 to-sky-50 p-8 sm:p-10"
        >
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_bottom_right,black,transparent_70%)]" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card">
              <Presentation className="h-6 w-6" />
            </span>
            <h2 className="mt-6 font-heading text-3xl font-bold text-ink">Teach students worldwide</h2>
            <p className="mt-3 max-w-md leading-relaxed text-ink-muted">
              Set your own hours, teach from home, and get paid monthly. We handle admissions and scheduling.
            </p>
            <ButtonLink href="/apply/teacher" size="lg" className="mt-7">
              Apply to teach <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
