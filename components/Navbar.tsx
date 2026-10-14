"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./ui/button";
import { Logo } from "./Logo";

const links = [
  { href: "/services", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/payment", label: "Payments" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  // Adds a soft shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "border-line shadow-card" : "border-line/60"
      )}
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors",
                  active ? "text-brand-700" : "text-ink-soft hover:text-ink"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-brand-50"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/apply/teacher" variant="ghost" size="sm">
            Teach with us
          </ButtonLink>
          <ButtonLink href="/apply/student" size="sm">
            Apply as a student
          </ButtonLink>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden border-t border-line bg-white lg:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 font-medium text-ink hover:bg-sky-50">
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2">
              <ButtonLink href="/apply/student">Apply as a student</ButtonLink>
              <ButtonLink href="/apply/teacher" variant="secondary">
                Teach with us
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
