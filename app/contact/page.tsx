"use client";

import { useState } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import MarketingShell from "@/components/Marketing/MarketingShell";
import Button from "@/components/Common/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Get in touch
            </span>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              We&apos;d love to hear from you.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-600">
              Whether you have a question about pricing, need help with your account, or just want to say hi. Our team replies within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Cards + Form */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Info cards */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  title: "Email us",
                  body: "Drop us a line any time.",
                  detail: "hello@postpilot.io",
                  href: "mailto:hello@postpilot.io",
                },
                {
                  icon: MessageCircle,
                  title: "Sales",
                  body: "Talk to us about teams and enterprise.",
                  detail: "sales@postpilot.io",
                  href: "mailto:sales@postpilot.io",
                },
                {
                  icon: MapPin,
                  title: "Location",
                  body: "We're a remote-first team.",
                  detail: "Worldwide",
                  href: undefined,
                },
              ].map(({ icon: Icon, title, body, detail, href }) => (
                <div
                  key={title}
                  className="rounded-xl border border-neutral-200 bg-[#FAFAF9] p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{body}</p>
                  {href ? (
                    <a href={href} className="mt-2 block text-sm font-medium text-brand hover:underline">
                      {detail}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-medium text-ink">{detail}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-xl border border-neutral-200 bg-[#FAFAF9] p-12 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand text-2xl">✓</span>
                  <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-ink">Message sent!</h2>
                  <p className="mt-3 max-w-sm text-sm text-neutral-600">
                    Thanks for reaching out. We&apos;ll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-xl border border-neutral-200 bg-[#FAFAF9] p-8"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13px] font-medium text-ink">Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Alex Rivera"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-ink">Email</label>
                      <input
                        required
                        type="email"
                        placeholder="alex@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[13px] font-medium text-ink">Subject</label>
                      <input
                        required
                        type="text"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[13px] font-medium text-ink">Message</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Tell us what's on your mind..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="mt-1.5 w-full resize-none rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button type="submit" className="bg-ink hover:bg-neutral-800">
                      Send message
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
