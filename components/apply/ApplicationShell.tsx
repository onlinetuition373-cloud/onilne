import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

// Shared frame for both application forms: header, side notes, and success state.
export function ApplicationShell({
  title,
  description,
  image,
  aside,
  children,
}: {
  title: string;
  description: string;
  image: { src: string; alt: string };
  aside: { title: string; points: string[] };
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} description={description} image={image} />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-8">{children}</div>
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-line bg-sky-50 p-6 lg:sticky lg:top-28">
            <h2 className="font-heading text-lg font-semibold text-ink">{aside.title}</h2>
            <ul className="mt-4 space-y-3">
              {aside.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

export function ApplicationSuccess({ title, message, reference }: { title: string; message: string; reference?: string }) {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
      <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
      <h1 className="mt-5 font-heading text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-3 leading-relaxed text-ink-muted">{message}</p>
      {reference && (
        <p className="mt-5 inline-block rounded-lg bg-sky-100 px-3 py-1.5 text-sm text-ink-soft">
          Reference <span className="font-semibold text-ink">{reference}</span>
        </p>
      )}
      <div className="mt-8">
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}

export function ReviewList({ rows }: { rows: { label: string; value?: string | number | null }[] }) {
  return (
    <dl className="divide-y divide-line rounded-xl border border-line">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-3 gap-4 px-4 py-2.5 text-sm">
          <dt className="text-ink-muted">{r.label}</dt>
          <dd className="col-span-2 font-medium text-ink">{r.value === undefined || r.value === "" ? "Not provided" : r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
