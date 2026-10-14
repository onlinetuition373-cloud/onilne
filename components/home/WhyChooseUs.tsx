import { ShieldCheck, Clock3, Globe2, LineChart, UserRound, Video } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { CountUp, Reveal, Stagger } from "@/components/motion";
import { FeatureCard } from "@/components/FeatureCard";
import { media } from "@/lib/media";

const features = [
  { icon: ShieldCheck, title: "Vetted teachers", desc: "Subject test, demo class, and background check before a teacher is assigned.", image: media.features.vetted },
  { icon: Globe2, title: "Every time zone", desc: "Slots from early morning to late evening for families in North America, Europe, the Gulf, and Asia.", image: media.features.timezones },
  { icon: Clock3, title: "Flexible rescheduling", desc: "Move a class with 12 hours notice at no extra cost.", image: media.features.rescheduling },
  { icon: LineChart, title: "Monthly progress reports", desc: "Clear notes on what was covered, what improved, and what comes next.", image: media.features.reports },
  { icon: UserRound, title: "Female teachers available", desc: "Choose a male or female teacher for any program.", image: media.features.femaleTeachers },
  { icon: Video, title: "Recorded lessons on request", desc: "Revisit a lesson before a test, with parental consent.", image: media.features.recordings },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            title="Built for families who live far from home"
            description="Most of our students study abroad or in international schools. The academy runs around their calendar."
          />
          <dl className="mt-10 grid grid-cols-2 gap-6">
            {siteConfig.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-gradient-to-br from-white to-sky-50 p-4">
                <dd className="font-heading text-4xl font-bold text-brand-600">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-1 text-sm text-ink-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
        <Stagger as="ul" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8 lg:pl-8">
          {features.map((f) => (
            <FeatureCard key={f.title} as="li" {...f} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
