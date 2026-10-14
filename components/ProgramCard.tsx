import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ProgramCard({
  image,
  alt,
  title,
  description,
  href,
  tags,
}: {
  image: string;
  alt: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-soft"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sky-100">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-xl font-semibold text-ink">{title}</h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </div>
        <p className="mt-2 leading-relaxed text-ink-muted">{description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li key={t} className="rounded-md bg-sky-100 px-2 py-1 text-xs font-medium text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
