import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";
import { siteConfig } from "@/lib/site-config";
import { programs } from "@/lib/programs";
import { Logo } from "./Logo";

const academyLinks = [
  { href: "/about", label: "About us" },
  { href: "/payment", label: "Payments" },
  { href: "/contact", label: "Contact" },
  { href: "/apply/student", label: "Apply as a student" },
  { href: "/apply/teacher", label: "Teach with us" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-sky-50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">{siteConfig.description}</p>
            <div className="mt-5 flex gap-2">
              {[
                { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink-soft hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-heading font-semibold text-ink">Academy</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {academyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-muted hover:text-brand-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-heading font-semibold text-ink">Programs</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {programs.map((p) => (
                <li key={p.id}>
                  <Link href={`/services#${p.anchor}`} className="text-ink-muted hover:text-brand-600">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-heading font-semibold text-ink">Admissions</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <a href={`mailto:${siteConfig.contact.admissionsEmail}`} className="hover:text-brand-600">
                  {siteConfig.contact.admissionsEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {siteConfig.contact.phone}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {siteConfig.contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.academyName}. All rights reserved.
          </p>
          <p>Classes taught live online, worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
