"use client";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Hero messages. The background video stays constant; only this text rotates.
// Edit copy here. Keep headlines to a similar length so the hero height stays steady.
const slides = [
  {
    tab: "Grades 1 to 9",
    eyebrow: "School tutoring for Grades 1 to 9",
    title: "Stronger grades from Grade 1 to 9,",
    highlight: "with a teacher who knows your child.",
    desc: "Live one-to-one lessons in Maths, English, Science, and Urdu for British, American, IB, and Pakistani curricula. Every student starts with a free assessment call.",
    cta: { href: "/apply/student", label: "Book a free assessment" },
    secondary: { href: "/services#tutoring", label: "Explore tutoring" },
  },
  {
    tab: "Hifz-e-Quran",
    eyebrow: "Hifz-e-Quran and Tajweed",
    title: "Memorise the Quran with care,",
    highlight: "one ayah at a time.",
    desc: "Ijazah-holding teachers guide your child from Noorani Qaida to complete Hifz, with daily sabaq, sabqi, and manzil revision. Male and female teachers available.",
    cta: { href: "/apply/student", label: "Book a free Quran assessment" },
    secondary: { href: "/services#quran", label: "Explore Quran classes" },
  },
  {
    tab: "Assignments",
    eyebrow: "Assignment and academic writing coaching",
    title: "Write assignments with confidence,",
    highlight: "and hand in work that is truly yours.",
    desc: "One-to-one coaching in research, planning, structure, and referencing, with feedback on your own drafts. For school, college, and university students.",
    cta: { href: "/apply/student", label: "Book a free writing session" },
    secondary: { href: "/services#writing", label: "Explore writing coaching" },
  },
];

const DURATION = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)", transition: { duration: 0.35, ease } },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

export function HeroSlides() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const autoplay = !reduce && !paused;

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);

  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(next, DURATION);
    return () => clearTimeout(id);
  }, [autoplay, index, next]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* All slides share one grid cell, so the block is always as tall as the longest slide (no layout jump) */}
      <div className="grid" aria-live={autoplay ? "off" : "polite"}>
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <motion.div
              key={s.tab}
              className={cn("col-start-1 row-start-1", !active && "pointer-events-none")}
              variants={group}
              initial={i === 0 ? "show" : "hidden"}
              animate={active ? "show" : "hidden"}
              aria-hidden={!active}
              // Keeps links in hidden slides out of the tab order
              ref={(el) => {
                if (el) el.toggleAttribute("inert", !active);
              }}
            >
              <motion.p variants={line} className="text-sm font-semibold uppercase tracking-wider text-brand-300">
                {s.eyebrow}
              </motion.p>
              <motion.h1
                variants={line}
                className="mt-4 text-balance font-heading text-[2.4rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-[4rem]"
              >
                {s.title}{" "}
                <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-sky-300 bg-clip-text text-transparent">
                  {s.highlight}
                </span>
              </motion.h1>
              <motion.p variants={line} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/80">
                {s.desc}
              </motion.p>
              <motion.div variants={line} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={s.cta.href} size="lg">
                  {s.cta.label}
                </ButtonLink>
                <ButtonLink
                  href={s.secondary.href}
                  variant="secondary"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white backdrop-blur hover:border-white/60 hover:bg-white/20"
                >
                  {s.secondary.label}
                </ButtonLink>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide tabs with a progress bar on the active one */}
      <div className="mt-10 grid max-w-xl grid-cols-3 gap-3" role="tablist" aria-label="Programs">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setIndex(i)}
              className="group min-w-0 text-left"
            >
              <span className="block h-1 overflow-hidden rounded-full bg-white/20">
                <span
                  key={active ? `${index}-${paused}` : "idle"}
                  className={cn(
                    "block h-full origin-left rounded-full bg-white",
                    active ? (autoplay ? "animate-hero-progress" : "scale-x-100") : "scale-x-0"
                  )}
                  style={active && autoplay ? { animationDuration: `${DURATION}ms` } : undefined}
                />
              </span>
              <span
                className={cn(
                  "mt-2.5 flex flex-col gap-0.5 text-xs font-semibold transition-colors sm:flex-row sm:items-baseline sm:gap-2 sm:text-sm",
                  active ? "text-white" : "text-white/55 group-hover:text-white/85"
                )}
              >
                <span className="tabular-nums text-brand-300">{String(i + 1).padStart(2, "0")}</span>
                {s.tab}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
