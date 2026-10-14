import { Compass } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white">
        <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center">
          <span className="flex h-16 w-16 animate-fade-up items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
            <Compass className="h-8 w-8" />
          </span>
          <p className="mt-8 font-heading text-sm font-semibold uppercase tracking-wider text-brand-600">Error 404</p>
          <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            We could not find that page
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            The link may be old or mistyped. Head back home or explore our programs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">Back to home</ButtonLink>
            <ButtonLink href="/services" variant="secondary" size="lg">Explore programs</ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
