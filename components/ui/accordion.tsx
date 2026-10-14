"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

// Each item is its own card. The open item lifts with a brand border and shadow.
export function AccordionItem({ className, ...props }: AccordionPrimitive.AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "rounded-2xl border border-line bg-white px-5 transition-all duration-300 hover:border-brand-200 data-[state=open]:border-brand-200 data-[state=open]:shadow-card sm:px-6",
        className
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-5 py-5 text-left font-heading text-base font-semibold text-ink transition-colors hover:text-brand-700 sm:text-lg",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-4">{children}</span>
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-brand-600 group-data-[state=open]:text-white"
        >
          <Plus className="h-4 w-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-ink-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-5 leading-relaxed">{children}</div>
    </AccordionPrimitive.Content>
  );
}
