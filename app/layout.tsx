import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
const body = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.academyName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.academyName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.academyName,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.academyName,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B43DD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="bg-white font-body text-ink antialiased">{children}</body>
    </html>
  );
}
