import Image from "next/image";
import { CalendarCheck, ClipboardList, PhoneCall, MonitorPlay } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Float, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { media } from "@/lib/media";

const steps = [
  { icon: ClipboardList, title: "Apply online", desc: "Tell us the student's curriculum, goals, and time zone. It takes about four minutes." },
  { icon: PhoneCall, title: "Free assessment call", desc: "A coordinator calls within one working day to understand the student's level." },
  { icon: CalendarCheck, title: "Match and fee plan", desc: "We match a teacher and send a fee plan in your currency before anything is paid." },
  { icon: MonitorPlay, title: "Start live classes", desc: "Join from any device. Parents receive a progress report every month." },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-sky-50 py-20 lg:py-24">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal from="left" className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-soft">
            <Image src={media.family.src} alt={media.family.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />
          </div>
          <Float className="absolute -bottom-6 right-4 sm:-right-6" distance={8}>
            <div className="rounded-2xl border border-white/70 bg-white/95 px-5 py-4 shadow-soft backdrop-blur">
              <p className="font-heading text-3xl font-bold text-brand-600">7 days</p>
              <p className="text-sm text-ink-muted">Average time to first class</p>
            </div>
          </Float>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              title="From application to first class in a week"
              description="A simple, guided process. You speak to a real coordinator before anything is paid."
            />
          </Reveal>
          <Stagger as="ol" className="relative mt-10 space-y-4">
            {/* Vertical connector line behind the step icons */}
            <span aria-hidden className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-brand-300 via-brand-200 to-transparent" />
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <StaggerItem
                as="li"
                key={title}
                className="group relative flex gap-5 rounded-2xl border border-transparent p-3 transition-colors duration-300 hover:border-line hover:bg-white hover:shadow-card"
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card ring-1 ring-line transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="pt-1">
                  <span className="font-heading text-xs font-semibold uppercase tracking-wider text-brand-600">Step {i + 1}</span>
                  <h3 className="mt-1 font-heading text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-muted">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
