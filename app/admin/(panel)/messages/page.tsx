"use client";
import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminStore";
import { Avatar, EmptyState, PageTitle, Panel } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { date, relative } from "@/lib/admin/format";

export default function MessagesPage() {
  const { data, markMessageRead } = useAdmin();
  const [selectedId, setSelectedId] = useState<string | null>(data.messages[0]?.id ?? null);
  const selected = data.messages.find((m) => m.id === selectedId);

  function open(id: string) {
    setSelectedId(id);
    markMessageRead(id);
  }

  return (
    <>
      <PageTitle title="Messages" description="Enquiries sent from the Contact page." />
      <Panel bodyClassName="p-0">
        {data.messages.length === 0 ? (
          <EmptyState title="Inbox is empty" description="Messages from the Contact page will appear here." />
        ) : (
          <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-5">
            <ul className="divide-y divide-line border-b border-line md:col-span-2 md:border-b-0 md:border-r">
              {data.messages.map((msg) => (
                <li key={msg.id}>
                  <button
                    onClick={() => open(msg.id)}
                    aria-current={selectedId === msg.id}
                    className={cn("flex w-full gap-3 px-4 py-3.5 text-left transition-colors", selectedId === msg.id ? "bg-brand-50" : "hover:bg-sky-50")}
                  >
                    <Avatar name={msg.name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-sm", msg.read ? "text-ink-soft" : "font-semibold text-ink")}>{msg.name}</span>
                        <span className="shrink-0 text-xs text-ink-muted">{relative(msg.receivedAt)}</span>
                      </span>
                      <span className={cn("block truncate text-sm", msg.read ? "text-ink-muted" : "font-medium text-ink")}>{msg.subject}</span>
                      <span className="block truncate text-xs text-ink-muted">{msg.country}</span>
                    </span>
                    {!msg.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="p-6 md:col-span-3">
              {selected ? (
                <article>
                  <h2 className="font-heading text-xl font-semibold text-ink">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {selected.name}, {selected.country}. Received {date(selected.receivedAt)}
                  </p>
                  <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-soft">{selected.message}</p>
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
                      <Mail className="h-4 w-4" /> Reply by email
                    </a>
                    <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink hover:bg-sky-50">
                      <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
                    </a>
                  </div>
                </article>
              ) : (
                <EmptyState title="Select a message" />
              )}
            </div>
          </div>
        )}
      </Panel>
    </>
  );
}
