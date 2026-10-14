"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard not available in this browser
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-sky-50",
        className
      )}
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-success" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> Copy
        </>
      )}
    </button>
  );
}
