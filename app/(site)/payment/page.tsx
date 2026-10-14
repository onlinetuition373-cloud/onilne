"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Upload, ShieldCheck } from "lucide-react";
import { Input, Select, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { media } from "@/lib/media";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { SectionHeading } from "@/components/SectionHeading";
import { paymentProofSchema, type PaymentProofInput } from "@/lib/schemas";
import { submitPaymentProof } from "@/lib/submissions";
import { uploadFile } from "@/lib/uploads";
import { siteConfig } from "@/lib/site-config";
import { programs } from "@/lib/programs";

const steps = [
  "Use the amount and currency on your fee plan.",
  "Pay with any method below and add your student ID as the reference.",
  "Save a screenshot or receipt of the transaction.",
  "Submit the details in the form on this page.",
  "Accounts confirms your payment by email within 24 hours.",
];

const methods = siteConfig.paymentMethods;

export default function PaymentPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentProofInput>({ resolver: zodResolver(paymentProofSchema) });

  async function onSubmit(data: PaymentProofInput) {
    const fileList = data.screenshot as FileList | undefined;
    if (fileList && fileList.length > 0) {
      await uploadFile(fileList[0], "payment-proofs");
    }
    const result = await submitPaymentProof(data);
    if (result.success) {
      setSent(true);
      reset();
    }
  }

  return (
    <>
      <PageHeader
        image={media.pageHeaders.payment}
        title="Payments"
        description="Pay your fee plan from any country, then send us the transaction details so we can confirm it."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading title="How to pay" />
            <ol className="mt-6 space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-ink-soft">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 flex gap-3 rounded-xl bg-sky-50 p-4 text-sm leading-relaxed text-ink-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand-600" />
              We never ask for card numbers or passwords over WhatsApp or email.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {Object.values(methods).map((m) => (
              <PaymentMethodCard key={m.label} title={m.label} region={m.region} rows={m.rows} />
            ))}
          </div>
        </div>
      </section>

      <section id="submit" className="border-t border-line bg-sky-50 py-14 lg:py-16">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <SectionHeading title="Submit payment details" align="center" />
          <Card className="mt-8 p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ink">Payment details received</h2>
                <p className="mt-2 text-ink-muted">Accounts will confirm your payment by email within 24 hours.</p>
                <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
                  Submit another payment
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Student or payer name" htmlFor="name" error={errors.name?.message}>
                    <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
                  </Field>
                  <Field label="Email" htmlFor="email" error={errors.email?.message}>
                    <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Student ID (optional)" htmlFor="studentId" hint="Shown on your fee plan, for example STU-1042">
                    <Input id="studentId" {...register("studentId")} />
                  </Field>
                  <Field label="Program" htmlFor="program" error={errors.program?.message}>
                    <Select id="program" defaultValue="" aria-invalid={!!errors.program} {...register("program")}>
                      <option value="" disabled>
                        Select a program
                      </option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="Currency" htmlFor="currency" error={errors.currency?.message}>
                    <Select id="currency" defaultValue="USD" {...register("currency")}>
                      {siteConfig.currencies.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Amount paid" htmlFor="amountPaid" error={errors.amountPaid?.message} className="sm:col-span-2">
                    <Input id="amountPaid" type="number" inputMode="decimal" step="0.01" aria-invalid={!!errors.amountPaid} {...register("amountPaid")} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Payment method" htmlFor="paymentMethod" error={errors.paymentMethod?.message}>
                    <Select id="paymentMethod" defaultValue="" aria-invalid={!!errors.paymentMethod} {...register("paymentMethod")}>
                      <option value="" disabled>
                        Select a method
                      </option>
                      <option value="international-bank">{methods.internationalBank.label}</option>
                      <option value="wise">{methods.wise.label}</option>
                      <option value="paypal">{methods.paypal.label}</option>
                      <option value="local">{methods.local.label}</option>
                    </Select>
                  </Field>
                  <Field label="Transaction or reference ID" htmlFor="transactionId" error={errors.transactionId?.message}>
                    <Input id="transactionId" aria-invalid={!!errors.transactionId} {...register("transactionId")} />
                  </Field>
                </div>
                <Field label="Receipt or screenshot (image or PDF)" htmlFor="screenshot">
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-white p-4">
                    <Upload className="h-5 w-5 text-brand-600" />
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*,.pdf"
                      {...register("screenshot")}
                      className="w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:font-medium file:text-brand-700"
                    />
                  </div>
                </Field>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Submitting..." : "Submit payment details"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
