import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with admissions on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16.001 3C9.1 3 3.5 8.6 3.5 15.5c0 2.3.62 4.46 1.7 6.32L3 29l7.36-2.14a12.4 12.4 0 0 0 5.64 1.36c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16 3zm0 22.7c-1.9 0-3.7-.5-5.27-1.44l-.38-.22-4.37 1.27 1.3-4.26-.25-.4a10.2 10.2 0 0 1-1.6-5.55c0-5.66 4.6-10.26 10.26-10.26 5.66 0 10.26 4.6 10.26 10.26S21.67 25.7 16 25.7zm5.6-7.68c-.3-.15-1.83-.9-2.11-1-.28-.1-.49-.15-.7.15-.2.3-.8 1-.98 1.2-.18.2-.36.23-.67.08-.3-.15-1.28-.47-2.44-1.5a9.1 9.1 0 0 1-1.7-2.1c-.17-.3 0-.47.14-.62.14-.14.3-.36.46-.55.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.17 4.56.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.83-.75 2.1-1.47.25-.72.25-1.34.18-1.47-.08-.13-.28-.2-.58-.35z" />
      </svg>
    </a>
  );
}
