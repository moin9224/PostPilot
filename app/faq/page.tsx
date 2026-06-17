"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus } from "lucide-react";
import MarketingShell from "@/components/Marketing/MarketingShell";
import Button from "@/components/Common/Button";
import { FAQS } from "@/lib/constants";

const CATEGORIES = [
  {
    label: "Getting started",
    questions: [0, 1, 7],
  },
  {
    label: "Features",
    questions: [2, 3, 4, 9],
  },
  {
    label: "Teams & plans",
    questions: [5, 8],
  },
  {
    label: "General",
    questions: [6],
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const visibleFaqs =
    activeCategory === "All"
      ? FAQS
      : (() => {
          const cat = CATEGORIES.find((c) => c.label === activeCategory);
          return cat ? cat.questions.map((i) => FAQS[i]) : FAQS;
        })();

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Help center
            </span>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              Frequently asked questions.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-600">
              Everything you need to know about PostPilot. Can&apos;t find your
              answer? We reply to every email within one business day.
            </p>
            <div className="mt-7">
              <Link href="/contact">
                <Button variant="secondary">
                  Contact support <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ body */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            {/* Sidebar filter */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-1">
                {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setOpen(null); }}
                    className={`block w-full rounded-md px-3 py-1.5 text-left text-[13px] transition-colors ${
                      activeCategory === cat
                        ? "bg-neutral-100 font-medium text-ink"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-ink"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Mobile filter pills */}
            <div className="lg:hidden -mt-4 mb-2 flex flex-wrap gap-2">
              {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpen(null); }}
                  className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                    activeCategory === cat
                      ? "border-ink bg-ink text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="max-w-2xl">
              <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {visibleFaqs.map((item, i) => {
                  const isOpen = open === i;
                  return (
                    <div key={item.question}>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[15px] font-medium text-ink">
                          {item.question}
                        </span>
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors">
                          {isOpen ? (
                            <Minus className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5 rotate-45" />
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="-mt-1 pb-6 pr-12 text-sm leading-relaxed text-neutral-600">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Still have questions */}
              <div className="mt-12 rounded-xl border border-neutral-200 bg-[#FAFAF9] p-8">
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                  Still have questions?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Can&apos;t find what you&apos;re looking for? Our team is happy to help. We
                  reply to every message within one business day.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Link href="/contact">
                    <Button className="bg-ink hover:bg-neutral-800">
                      Send us a message <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="mailto:hello@postpilot.io">
                    <Button variant="secondary">hello@postpilot.io</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
