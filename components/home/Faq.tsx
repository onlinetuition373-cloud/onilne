import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/SectionHeading";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { media } from "@/lib/media";
import { siteConfig } from "@/lib/site-config";
import { brandShape, cn } from "@/lib/utils";

export const faqs = [
  {
    q: "Which countries do you teach in?",
    a: "Classes are live online, so students can join from anywhere. Most families are in the UK, Canada, the US, the Gulf, Australia, and Pakistan.",
  },
  {
    q: "How are class times set across time zones?",
    a: "You share your time zone when you apply. Your coordinator books slots in your local time and confirmation messages always show both your time and the teacher's.",
  },
  {
    q: "How much do classes cost?",
    a: "Fees depend on the program, level, and number of classes each week. After the free assessment call you receive a written fee plan in your preferred currency, with no obligation.",
  },
  {
    q: "How do I pay from outside Pakistan?",
    a: "Pay by international bank transfer, Wise, or PayPal. Then submit the transaction reference on the Payments page so our accounts team can confirm it within 24 hours.",
  },
  {
    q: "Does writing coaching mean you complete assignments for students?",
    a: "No. Coaches teach research, planning, structure, and referencing, and give feedback on the student's own drafts. All submitted work stays the student's own.",
  },
  {
    q: "Can I request a female teacher?",
    a: "Yes. You can choose a male or female teacher for any program when you apply.",
  },
];

export function Faq() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-sky-50 py-20 lg:py-28">
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-5 lg:grid-cols-12 lg:gap-14 lg:px-8">
        {/* Left: heading and photo with a WhatsApp prompt */}
        <Reveal from="left" className="lg:sticky lg:top-28 lg:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">FAQ</p>
          <SectionHeading className="mt-2" title="Questions families ask" />
          <div className={cn(brandShape, "relative mt-8 aspect-[4/5] overflow-hidden bg-sky-200 shadow-soft sm:aspect-[5/4] lg:aspect-[4/5]")}>
            <Image
              src={media.faq.src}
              alt={media.faq.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-4 rounded-2xl rounded-bl-[40px] border border-white/60 bg-white/95 p-4 shadow-soft backdrop-blur sm:inset-x-5 sm:bottom-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M16 3C9.1 3 3.5 8.6 3.5 15.5c0 2.3.62 4.46 1.7 6.32L3 29l7.36-2.14A12.4 12.4 0 0 0 16 28.2c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16 3zm5.6 15.02c-.3-.15-1.83-.9-2.11-1-.28-.1-.49-.15-.7.15-.2.3-.8 1-.98 1.2-.18.2-.36.23-.67.08-.3-.15-1.28-.47-2.44-1.5a9.1 9.1 0 0 1-1.7-2.1c-.17-.3 0-.47.14-.62.14-.14.3-.36.46-.55.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.17 4.56.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.83-.75 2.1-1.47.25-.72.25-1.34.18-1.47-.08-.13-.28-.2-.58-.35z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold text-ink">Still have a question?</p>
                <p className="text-sm text-ink-muted">Admissions replies on WhatsApp the same day.</p>
              </div>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-flex"
              >
                Chat now
              </a>
            </div>
          </div>
        </Reveal>

        {/* Right: questions */}
        <Reveal delay={0.1} className="lg:col-span-7 lg:pt-12">
          <Accordion type="single" collapsible defaultValue={faqs[0].q} className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>
                  <span className="font-heading text-sm font-bold tabular-nums text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pl-9">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex font-semibold text-brand-700 underline-offset-4 hover:underline sm:hidden"
          >
            Ask admissions on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
