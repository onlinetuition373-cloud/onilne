import { GraduationCap } from "lucide-react";

const curricula = [
  "GCSE and IGCSE",
  "O and A Level",
  "American High School",
  "IB MYP and DP",
  "Matric and FSc",
  "Tajweed and Hifz",
  "Academic Writing",
  "Noorani Qaida",
];

// Continuously scrolling strip. The list is rendered twice so the loop is seamless.
export function CurriculaStrip() {
  return (
    <section aria-label="Curricula we teach" className="border-y border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <p className="flex shrink-0 items-center gap-2 text-sm font-semibold text-ink">
          <GraduationCap className="h-4 w-4 text-brand-600" /> Curricula we teach
        </p>
        <div className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="flex w-max animate-marquee gap-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...curricula, ...curricula].map((c, i) => (
              <li
                key={`${c}-${i}`}
                aria-hidden={i >= curricula.length}
                className="whitespace-nowrap rounded-lg border border-line bg-sky-50/60 px-3 py-1.5 text-sm text-ink-soft"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
