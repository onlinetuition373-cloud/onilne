// Lightweight SVG charts, no chart library needed. Colours come from the brand tokens.
import { cn } from "@/lib/utils";

export function ColumnChart({
  data,
  format = (v) => String(v),
  highlightLast = true,
  height = 180,
}: {
  data: { label: string; value: number }[];
  format?: (v: number) => string;
  highlightLast?: boolean;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }} role="img" aria-label={data.map((d) => `${d.label}: ${format(d.value)}`).join(", ")}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const last = highlightLast && i === data.length - 1;
        return (
          <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className={cn("text-[11px] font-semibold tabular-nums", last ? "text-brand-700" : "text-ink-muted")}>{format(d.value)}</span>
            <div
              className={cn("w-full max-w-[38px] rounded-t-md transition-colors", last ? "bg-brand-600" : "bg-brand-200 group-hover:bg-brand-300")}
              style={{ height: `${Math.max(pct, 2)}%` }}
            />
            <span className="text-[11px] text-ink-muted">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function PairedColumnChart({
  data,
  format,
  height = 190,
}: {
  data: { label: string; a: number; b: number }[];
  format: (v: number) => string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.a, d.b)), 1);
  return (
    <div>
      <div className="flex items-end gap-3 sm:gap-5" style={{ height }} role="img" aria-label="Billed versus collected by month">
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div className="w-full max-w-[18px] rounded-t bg-sky-300" style={{ height: `${Math.max((d.a / max) * 100, 2)}%` }} title={`Billed ${format(d.a)}`} />
              <div className="w-full max-w-[18px] rounded-t bg-brand-600" style={{ height: `${Math.max((d.b / max) * 100, 2)}%` }} title={`Collected ${format(d.b)}`} />
            </div>
            <span className="text-[11px] text-ink-muted">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-5 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-300" /> Billed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> Collected
        </span>
      </div>
    </div>
  );
}

export function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string; display: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" role="img" aria-label={segments.map((s) => `${s.label} ${s.display}`).join(", ")}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="#EAF1FF" strokeWidth="18" />
          {segments.map((s) => {
            const len = (s.value / total) * c;
            const el = (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="18"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-heading text-xl font-bold text-ink tabular-nums">{centerValue}</span>
          <span className="text-[11px] text-ink-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-3">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-soft">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-semibold text-ink tabular-nums">{s.display}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({ data, max: maxProp }: { data: { label: string; value: number }[]; max?: number }) {
  const max = maxProp ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink-soft">{d.label}</span>
            <span className="font-semibold text-ink tabular-nums">{d.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sky-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
