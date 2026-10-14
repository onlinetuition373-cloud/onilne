import Image from "next/image";
import { BadgeCheck, BookOpenCheck, MonitorPlay, ShieldCheck } from "lucide-react";
import { media } from "@/lib/media";
import { siteConfig } from "@/lib/site-config";

const checks = [
  { icon: BookOpenCheck, label: "Subject test" },
  { icon: MonitorPlay, label: "Demo class" },
  { icon: ShieldCheck, label: "Background check" },
];

// Hero card showing the three checks every teacher passes before teaching.
export function VettingCard() {
  const teacherCount = siteConfig.stats[1].value;
  return (
    <div className="rounded-2xl rounded-tr-[50px] rounded-bl-[50px] border border-white/60 bg-white/95 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3 pr-3">
        <p className="font-heading text-[15px] font-semibold text-ink">Every teacher passes 3 checks</p>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
          <BadgeCheck className="h-3.5 w-3.5" /> Verified
        </span>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-2">
        {checks.map(({ icon: Icon, label }, i) => (
          <li key={label} className="rounded-xl bg-brand-50 px-2 py-3 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-brand-400">Step {i + 1}</p>
            <p className="text-xs font-semibold text-ink sm:text-[13px]">{label}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <div className="flex -space-x-2.5">
          {media.teachers.map((t) => (
            <span key={t.src} className="relative h-8 w-8 overflow-hidden rounded-full bg-sky-200 ring-2 ring-white">
              <Image src={t.src} alt="" fill sizes="32px" className="object-cover object-top" />
            </span>
          ))}
          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white ring-2 ring-white">
            +{teacherCount - media.teachers.length}
          </span>
        </div>
        <p className="text-xs leading-snug text-ink-muted">
          <span className="font-semibold text-ink">{teacherCount}+ vetted teachers</span> ready to match with your child
        </p>
      </div>
    </div>
  );
}
