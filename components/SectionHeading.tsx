import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: {
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-muted">{description}</p>}
    </div>
  );
}
