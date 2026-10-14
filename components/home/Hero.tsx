import { Star } from "lucide-react";
import { Float, Reveal } from "@/components/motion";
import { siteConfig } from "@/lib/site-config";
import { HeroSlides } from "./HeroSlides";
import { HeroVideo } from "./HeroVideo";
import { VettingCard } from "./VettingCard";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Background video, anchored right so the child and teacher stay visible beside the text */}
      <HeroVideo className="absolute inset-0 -z-20 h-full w-full bg-ink object-cover object-[70%_center]" />

      {/* Left-to-right brand gradient: solid behind the copy, fading to fully clear so the right side of the video shows.
          Phones get an even overlay instead, since the text spans the full width there. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-brand-900/75 to-ink/85 lg:bg-[linear-gradient(90deg,rgba(23,20,59,0.97)_0%,rgba(39,29,99,0.9)_30%,rgba(56,40,144,0.55)_50%,rgba(56,40,144,0)_68%)]" />
      {/* Soft shade at the bottom so the floating cards and wave stay readable over bright footage */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink/50 to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-brand-600/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-36 pt-16 lg:min-h-[680px] lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-40 lg:pt-20">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-300" />
              </span>
              Trusted by families in {siteConfig.stats[2].value} countries
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-6">
            <HeroSlides />
          </Reveal>
        </div>

        {/* Right: floating cards over the video */}
        <div className="relative lg:col-span-5 lg:self-end xl:col-span-4 xl:col-start-9">
          <Float className="mb-4 hidden justify-end lg:flex" distance={8}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink">Rated {siteConfig.rating} by parents</p>
                <p className="text-xs text-ink-muted">{siteConfig.stats[0].value.toLocaleString("en-US")}+ students taught</p>
              </div>
            </div>
          </Float>
          <Reveal from="right" delay={0.3}>
            <VettingCard />
          </Reveal>
        </div>
      </div>

      {/* Wave divider into the next section */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full sm:h-28"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="#ffffff" fillOpacity="0.35" d="M0 70C220 30 420 20 720 55s560 45 720 5v60H0z" />
        <path fill="#ffffff" d="M0 95c260-40 520-45 780-15s480 30 660 0v40H0z" />
      </svg>
    </section>
  );
}
