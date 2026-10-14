import { Quote, Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/SectionHeading";

const featured = {
  name: "Umm-e-Habiba",
  role: "Parent, Hifz program, Dubai",
  text: "Finding a patient, qualified female teacher for our son's Hifz was hard until we found this academy. Classes fit around school, and he looks forward to every one.",
};

const reviews = [
  {
    name: "Bilal R.",
    role: "Undergraduate, Toronto",
    rating: 5,
    text: "My coach worked around my time zone and taught me how to structure a research paper. My grades went up because I finally understood what markers want.",
  },
  {
    name: "Sara J.",
    role: "Parent, IGCSE Chemistry, London",
    rating: 5,
    text: "Clear monthly reports and a teacher who knows the Cambridge syllabus well. Predicted grade moved from a 5 to a 7.",
  },
  {
    name: "Ayesha K.",
    role: "Parent, O Level Physics, Lahore",
    rating: 5,
    text: "The teacher checks for understanding instead of rushing the syllabus. Results improved within two months.",
  },
  {
    name: "Imran A.",
    role: "Parent, Tajweed, Houston",
    rating: 5,
    text: "Structured Tajweed lessons at 6 PM our time. My son's recitation improved noticeably in a few weeks.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < count ? "fill-amber-400 text-amber-400" : "text-line"}`} aria-hidden />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading title="What families and students say" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal
            as="figure"
            from="left"
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-8 text-white shadow-soft lg:col-span-5 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <Quote className="relative h-10 w-10 text-brand-200" aria-hidden />
            <blockquote className="relative mt-6 font-heading text-2xl font-medium leading-snug sm:text-[1.7rem]">
              &ldquo;{featured.text}&rdquo;
            </blockquote>
            <figcaption className="relative mt-8 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-heading font-bold">
                {featured.name.charAt(0)}
              </span>
              <span>
                <span className="block font-semibold">{featured.name}</span>
                <span className="block text-sm text-brand-100">{featured.role}</span>
              </span>
            </figcaption>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {reviews.map((r) => (
              <StaggerItem
                as="figure"
                key={r.name}
                className="rounded-2xl border border-line bg-sky-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-card"
              >
                <Stars count={r.rating} />
                <blockquote className="mt-4 leading-relaxed text-ink-soft">{r.text}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-heading font-bold text-brand-700">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{r.name}</span>
                    <span className="block text-sm text-ink-muted">{r.role}</span>
                  </span>
                </figcaption>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
