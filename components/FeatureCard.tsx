import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { StaggerItem } from "@/components/motion";
import { brandShape, cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: { src: string; alt: string };
  as?: "div" | "li";
  className?: string;
};

// Shared feature card. Shows a photo with a dark overlay by default, and turns into a clean white
// card with a border on hover or keyboard focus. Used on the homepage and the About page.
export function FeatureCard({ icon: Icon, title, desc, image, as = "div", className }: FeatureCardProps) {
  return (
    <StaggerItem
      as={as}
      className={cn(
        brandShape,
        "group relative isolate flex min-h-[250px] flex-col justify-between overflow-hidden border border-transparent bg-white p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-line hover:shadow-card focus-within:border-line focus-within:shadow-card",
        className
      )}
    >
      {/* Photo layer: fades out on hover */}
      <Image
        src={image.src}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="-z-20 scale-105 object-cover transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-0 group-focus-within:opacity-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/60 to-brand-900/30 transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
      />

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:ring-transparent group-focus-within:bg-brand-600">
        <Icon className="h-5 w-5" />
      </div>

      <div className="mt-10">
        <h3 className="font-heading text-lg font-semibold text-white transition-colors duration-500 group-hover:text-ink group-focus-within:text-ink">
          {title}
        </h3>
        <p className="mt-1.5 leading-relaxed text-white/85 transition-colors duration-500 group-hover:text-ink-muted group-focus-within:text-ink-muted">
          {desc}
        </p>
      </div>
    </StaggerItem>
  );
}
