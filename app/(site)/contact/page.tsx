"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { Input, Textarea, Select, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { media } from "@/lib/media";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { submitContactMessage } from "@/lib/submissions";
import { siteConfig } from "@/lib/site-config";
import { countries } from "@/lib/programs";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    const result = await submitContactMessage(data);
    if (result.success) {
      setSent(true);
      reset();
    }
  }

  return (
    <>
      <PageHeader image={media.pageHeaders.contact} title="Contact admissions" description={siteConfig.contact.responseTime} />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Card className="p-6 sm:p-8 lg:col-span-7">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ink">Message sent</h2>
                <p className="mt-2 text-ink-muted">Thanks for getting in touch. Admissions will reply within one working day.</p>
                <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" error={errors.name?.message}>
                    <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
                  </Field>
                  <Field label="Email" htmlFor="email" error={errors.email?.message}>
                    <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Phone or WhatsApp" htmlFor="phone" error={errors.phone?.message} hint="Include your country code">
                    <Input id="phone" type="tel" autoComplete="tel" placeholder="+44 7700 900123" aria-invalid={!!errors.phone} {...register("phone")} />
                  </Field>
                  <Field label="Country" htmlFor="country" error={errors.country?.message}>
                    <Select id="country" defaultValue="" aria-invalid={!!errors.country} {...register("country")}>
                      <option value="" disabled>
                        Select your country
                      </option>
                      {countries.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
                  <Input id="subject" aria-invalid={!!errors.subject} {...register("subject")} />
                </Field>
                <Field label="Message" htmlFor="message" error={errors.message?.message}>
                  <Textarea id="message" aria-invalid={!!errors.message} {...register("message")} />
                </Field>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            )}
          </Card>

          <div className="space-y-6 lg:col-span-5">
            <Card>
              <h2 className="font-heading text-lg font-semibold text-ink">Reach us directly</h2>
              <ul className="mt-4 space-y-3.5 text-ink-soft">
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <a href={`https://wa.me/${siteConfig.whatsappNumber}`} className="hover:text-brand-600">
                    {siteConfig.contact.whatsapp} on WhatsApp
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> {siteConfig.contact.phone}
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-600">
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> {siteConfig.contact.address}
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="font-heading text-lg font-semibold text-ink">Admissions desk hours</h2>
              <ul className="mt-3 divide-y divide-line text-sm">
                {siteConfig.contact.officeHours.map((o) => (
                  <li key={o.days} className="flex justify-between py-2.5">
                    <span className="text-ink-muted">{o.days}</span>
                    <span className="font-medium text-ink">{o.hours}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="overflow-hidden rounded-2xl border border-line">
              <iframe
                src={siteConfig.contact.mapsEmbedUrl}
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                title="Head office location map"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
