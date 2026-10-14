import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card"
      >
        Skip to content
      </a>
      <Navbar />
      {/* overflow-x-clip stops slide-in animations causing sideways scroll on phones, without breaking sticky elements */}
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
