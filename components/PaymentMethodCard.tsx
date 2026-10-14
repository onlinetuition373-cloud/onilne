import { CopyButton } from "./CopyButton";

export function PaymentMethodCard({
  title,
  region,
  rows,
}: {
  title: string;
  region: string;
  rows: readonly { label: string; value: string; copyable?: boolean }[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
        <span className="text-xs font-medium text-brand-700">{region}</span>
      </div>
      <dl className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <dt className="text-xs text-ink-muted">{row.label}</dt>
              <dd className="break-all font-medium text-ink">{row.value}</dd>
            </div>
            {row.copyable && <CopyButton value={row.value} />}
          </div>
        ))}
      </dl>
    </div>
  );
}
