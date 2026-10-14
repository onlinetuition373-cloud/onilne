import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

// Shared hero band for every inner page (Programs, About, Contact, Payments, both application forms).
// Full-bleed background photo with a brand overlay and centered copy. Pass a different image per page.
export function PageHeader({
  title,
  description,
  image,
  children,
  className,
}: {
  title: string;
  description?: string;
  image: { src: string; alt: string };
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-ink", className)}>
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover" />

      {/* Brand overlay keeps white text readable on any photo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-brand-900/70 to-ink/85" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(23,20,59,0.35),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-[340px] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[400px] sm:py-24 lg:px-8">
        <Reveal className="flex flex-col items-center">
          <span className="mb-5 block h-1 w-12 rounded-full bg-gradient-to-r from-brand-300 to-sky-300" />
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/85">{description}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.18}>{children}</Reveal>}
      </div>

      {/* Same wave divider as the homepage hero, for a consistent transition into the page */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full sm:h-16"
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
