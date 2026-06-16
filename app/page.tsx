"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  Check,
  ChevronDown,
  Heart,
  Linkedin,
  MessageCircle,
  Minus,
  Repeat2,
  Send,
  Sparkles,
  Twitter,
  UsersRound,
} from "lucide-react";
import Button from "@/components/Common/Button";
import Logo from "@/components/Common/Logo";
import { FAQS, PRICING_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-ink antialiased">
      <Header />
      <main>
        <Hero />
        <SocialProofStrip />
        <Features />
        <Workflow />
        <Metrics />
        <Testimonial />
        <Pricing />
        <Faq />
        <CreatorsWall />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Header ---------- */
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-[#FAFAF9]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <a href="#features" className="transition-colors hover:text-ink">
            Product
          </a>
          <a href="#workflow" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-ink">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            FAQ
          </a>
        </nav>
        <div className="hidden items-center gap-1.5 sm:flex">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-ink hover:bg-neutral-800">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="sm:hidden rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1 text-sm text-neutral-700">
            <a href="#features" onClick={() => setMobileOpen(false)} className="py-2">Product</a>
            <a href="#workflow" onClick={() => setMobileOpen(false)} className="py-2">How it works</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="py-2">Pricing</a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="py-2">FAQ</a>
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-neutral-100 pt-3">
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full">Sign in</Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full bg-ink hover:bg-neutral-800">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200/70">
      {/* Grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      {/* Soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="#features"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-neutral-300"
          >
            <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
              New
            </span>
            <span>Reach Debugger v2 is live</span>
            <ArrowRight className="h-3 w-3 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
            The unfair advantage
            <br />
            <span className="text-neutral-400">for LinkedIn creators.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            PostPilot writes posts in your voice, schedules them when your
            audience is awake, and tells you exactly why a post under-performed.
            Built on Claude.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-ink hover:bg-neutral-800"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#workflow">
              <Button size="lg" variant="secondary">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-neutral-500">
            7 days free · No credit card · Cancel any time
          </p>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div
            aria-hidden
            className="absolute inset-x-12 -bottom-6 h-12 rounded-[40px] bg-ink/10 blur-2xl"
          />
          <div className="relative rounded-xl border border-neutral-200 bg-white p-2 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/60 md:grid-cols-[280px_1fr_360px]">
      {/* Sidebar */}
      <div className="hidden flex-col gap-1 border-r border-neutral-200 bg-white p-4 md:flex">
        <div className="flex items-center gap-2 px-2 pb-3">
          <span className="text-sm font-semibold tracking-tight">
            Post<span className="text-brand">Pilot</span>
          </span>
        </div>
        {[
          { icon: BarChart3, label: "Dashboard" },
          { icon: Sparkles, label: "Generator", active: true },
          { icon: CalendarClock, label: "Calendar" },
          { icon: BarChart3, label: "Analytics" },
          { icon: Sparkles, label: "Library" },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px]",
              item.active
                ? "bg-neutral-100 font-medium text-ink"
                : "text-neutral-500",
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="border-r border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            New post
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Draft saved
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-medium text-neutral-500">
              Topic
            </label>
            <div className="mt-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-ink">
              Lessons from shipping our first AI feature
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-500">
                Tone
              </label>
              <div className="mt-1 flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm">
                Inspiring
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-500">
                Length
              </label>
              <div className="mt-1 flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm">
                Medium
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Generate 3 variations
          </div>

          <div className="rounded-lg border border-neutral-200 bg-gradient-to-b from-white to-neutral-50/60 p-3 text-[13px] leading-relaxed text-neutral-700">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Variation 2 · 94% match
            </div>
            We shipped our first AI feature last week. Here&apos;s what nobody
            tells you about going from prototype to production…
            <span className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 animate-pulse bg-ink" />
          </div>
        </div>
      </div>

      {/* LinkedIn preview */}
      <div className="bg-neutral-100/70 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Preview
        </div>
        <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-action" />
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-ink">
                Alex Rivera
              </div>
              <div className="text-[11px] text-neutral-500">
                Founder @ Northwind · 1h
              </div>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-neutral-800">
            We shipped our first AI feature last week. Here&apos;s what nobody
            tells you about going from prototype to production…
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
              <Heart className="h-2.5 w-2.5 fill-current" />
            </span>
            <span>1,284 reactions · 86 comments</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              Like
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              Comment
            </span>
            <span className="inline-flex items-center gap-1">
              <Repeat2 className="h-3.5 w-3.5" />
              Repost
            </span>
            <span className="inline-flex items-center gap-1">
              <Send className="h-3.5 w-3.5" />
              Send
            </span>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-neutral-700">
              Predicted reach
            </span>
            <span className="font-semibold text-success">
              12.4k – 18.9k
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-brand to-action" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Social proof strip ---------- */
function SocialProofStrip() {
  const logos = ["Northwind", "Lattice", "Vercel", "Linear", "Notion", "Figma"];
  return (
    <section className="border-b border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Trusted by 12,000+ creators at
        </p>
        <div className="mt-6 grid grid-cols-3 items-center justify-items-center gap-6 sm:grid-cols-6">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-neutral-400 transition-colors hover:text-neutral-700"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features (Bento) ---------- */
function Features() {
  return (
    <section
      id="features"
      className="border-b border-neutral-200/70 bg-[#FAFAF9]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionEyebrow>Product</SectionEyebrow>
        <div className="mt-3 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
            Six tools, one workflow.
            <br />
            <span className="text-neutral-400">
              Replace your content stack.
            </span>
          </h2>
          <p className="max-w-sm text-sm text-neutral-600">
            Stop stitching together a generator, a scheduler, an analytics tab
            and a spreadsheet. PostPilot is the whole loop.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Row 1: Generation hero + Scheduling */}
          <BentoCard
            className="md:col-span-4"
            icon={Sparkles}
            eyebrow="Generation"
            title="Posts that sound like you wrote them."
            description="Claude-powered drafts tuned to your voice, audience and industry. Three variations every time, ranked by predicted reach."
          >
            <GenerationShowcase />
          </BentoCard>

          <BentoCard
            className="md:col-span-2"
            icon={CalendarClock}
            eyebrow="Scheduling"
            title="Publishes at peak attention."
            description="Auto-queues posts when your audience is actually online."
          >
            <SchedulingShowcase />
          </BentoCard>

          {/* Row 2: Analytics + Research + Diagnostics */}
          <BentoCard
            className="md:col-span-2"
            icon={BarChart3}
            eyebrow="Analytics"
            title="Reach you can read at a glance."
            description="Impressions, engagement and follower-flow in one dashboard."
          >
            <AnalyticsShowcase />
          </BentoCard>

          {/* Row 3: Teams (full-width dark capstone) */}
          <TeamsCapstone />
        </div>
      </div>
    </section>
  );
}

/* ---------- Per-card showcases ---------- */

function GenerationShowcase() {
  const tones = [
    "Professional",
    "Casual",
    "Inspiring",
    "Educational",
    "Story-led",
    "Contrarian",
  ];
  return (
    <div className="mt-6 space-y-3">
      {/* Topic field */}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Topic
        </div>
        <div className="mt-0.5 truncate text-[13px] text-ink">
          Lessons from shipping our first AI feature
        </div>
      </div>

      {/* Tones */}
      <div className="flex flex-wrap gap-1.5">
        {tones.map((t, i) => (
          <span
            key={t}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              i === 2
                ? "border-ink bg-ink text-white shadow-sm"
                : "border-neutral-200 bg-white text-neutral-600",
            )}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Output preview */}
      <div className="rounded-lg border border-neutral-200 bg-gradient-to-b from-white to-neutral-50/60 px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Variation 2 · 94% match
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-neutral-700">
          We shipped our first AI feature last week. Here&apos;s what nobody
          tells you about going from prototype to production…
          <span className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 animate-pulse bg-ink" />
        </p>
      </div>
    </div>
  );
}

function SchedulingShowcase() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const intensities = [
    1, 0, 2, 3, 2, 1, 0, 2, 3, 3, 2, 1, 0, 1, 0, 2, 3, 2, 1, 0, 1, 1, 0, 1,
    2, 3, 2, 0,
  ];
  return (
    <div className="mt-6">
      <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[9px] font-medium text-neutral-400">
        {days.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {intensities.map((intensity, i) => (
          <div
            key={i}
            className={cn(
              "h-3 rounded-sm",
              intensity === 0 && "bg-neutral-200/70",
              intensity === 1 && "bg-brand/20",
              intensity === 2 && "bg-brand/50",
              intensity === 3 && "bg-brand",
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-[11px]">
        <div className="flex items-center gap-1.5 text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Peak window
        </div>
        <span className="font-semibold text-ink">Tue · 9:00 AM</span>
      </div>
    </div>
  );
}

function AnalyticsShowcase() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const heights = [42, 36, 64, 52, 78, 92, 70];
  return (
    <div className="mt-6">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-[-0.02em] text-ink tabular-nums">
          182k
        </span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-success ring-1 ring-inset ring-emerald-100">
          <ArrowUpRight className="h-2.5 w-2.5" />
          24%
        </span>
      </div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        Impressions · last 7 days
      </div>
      <div className="mt-4 flex h-16 items-end gap-1.5">
        {heights.map((h, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t bg-gradient-to-t from-brand to-action",
              i === 5 && "ring-1 ring-inset ring-action/30",
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5 text-center text-[9px] font-medium text-neutral-400">
        {days.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function TeamsCapstone() {
  const members = [
    { initial: "M", grad: "from-brand to-action", role: "Admin", online: true },
    {
      initial: "A",
      grad: "from-action to-violet-500",
      role: "Editor",
      online: true,
    },
    {
      initial: "S",
      grad: "from-amber-400 to-rose-500",
      role: "Editor",
      online: false,
    },
    {
      initial: "K",
      grad: "from-emerald-400 to-teal-500",
      role: "Viewer",
      online: true,
    },
  ];
  const activity = [
    { who: "Maya", verb: "scheduled 3 posts", time: "2m" },
    { who: "Alex", verb: "approved the Q4 launch post", time: "1h" },
    { who: "Sam", verb: 'drafted "Hiring lessons"', time: "3h" },
  ];
  return (
    <div className="group relative col-span-1 overflow-hidden rounded-xl bg-ink p-8 text-white md:col-span-6 sm:p-10">
      {/* Glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-action/20 blur-3xl"
      />

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
        {/* Left: copy */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
              <UsersRound className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              For teams
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Ship together.{" "}
            <span className="text-white/50">On-brand. At scale.</span>
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Roles, approvals and a shared library for agencies and in-house
            teams. Built for the way real content actually gets made.
          </p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {["SSO", "Role-based access", "Approval workflows", "Audit log"].map(
              (c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/80"
                >
                  {c}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Right: team showcase */}
        <div className="relative">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            {/* Workspace header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Workspace
                </div>
                <div className="mt-0.5 text-sm font-semibold tracking-[-0.01em]">
                  Northwind Marketing
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                3 active
              </span>
            </div>

            {/* Avatar row with role */}
            <div className="mt-4 space-y-1.5">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-md bg-white/[0.03] px-2.5 py-1.5"
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white",
                        m.grad,
                      )}
                    >
                      {m.initial}
                    </div>
                    {m.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-ink" />
                    )}
                  </div>
                  <span className="flex-1 text-[12px] text-white/80">
                    {m.role === "Admin" ? "Maya Chen" : m.role === "Editor" && i === 1 ? "Alex Rivera" : m.role === "Editor" ? "Sam Park" : "Kira Holloway"}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      m.role === "Admin"
                        ? "bg-white text-ink"
                        : m.role === "Editor"
                          ? "bg-white/10 text-white/80"
                          : "bg-white/5 text-white/60",
                    )}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Recent activity
              </div>
              <ul className="mt-2 space-y-1.5">
                {activity.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[12px] text-white/70"
                  >
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-white/30" />
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-medium text-white">{a.who}</span>{" "}
                      {a.verb}
                    </span>
                    <span className="text-[11px] text-white/40 tabular-nums">
                      {a.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100 text-ink">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
      {children}
    </div>
  );
}

/* ---------- Workflow ---------- */
function Workflow() {
  const steps = [
    {
      n: "01",
      title: "Connect your LinkedIn",
      copy: "One OAuth click. We never store your password and you can disconnect any time.",
    },
    {
      n: "02",
      title: "Generate, edit, schedule",
      copy: "Draft posts in your voice, edit inline, and queue them for peak attention windows.",
    },
    {
      n: "03",
      title: "Learn what actually worked",
      copy: "Read clear analytics, run the Reach Debugger, and double down on what wins.",
    },
  ];
  return (
    <section
      id="workflow"
      className="border-b border-neutral-200/70 bg-white"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
            Three steps from blank page to compounding growth.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-white p-7">
              <div className="text-xs font-mono font-semibold tracking-wider text-brand">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {s.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Metrics ---------- */
function Metrics() {
  const stats = [
    { value: "12,400+", label: "Active creators" },
    { value: "3.4M", label: "Posts shipped" },
    { value: "+182%", label: "Avg. reach lift" },
    { value: "4.9 / 5", label: "G2 rating" },
  ];
  return (
    <section className="border-b border-neutral-200/70 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink px-6 py-8">
              <div className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/50">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonial ---------- */
function Testimonial() {
  return (
    <section className="border-b border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <SectionEyebrow>Customer</SectionEyebrow>
        <blockquote className="mt-6 text-2xl font-medium leading-snug tracking-[-0.015em] text-ink sm:text-3xl">
          “PostPilot replaced four tools and a freelancer. We went from
          posting twice a week to a daily cadence — and our inbound
          doubled in a quarter.”
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-action" />
          <div className="text-left">
            <div className="text-sm font-semibold text-ink">Maya Chen</div>
            <div className="text-xs text-neutral-500">
              Head of Marketing, Northwind
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
function Pricing() {
  return (
    <section
      id="pricing"
      className="border-b border-neutral-200/70 bg-[#FAFAF9]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Pricing</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
            Honest pricing. Real ROI.
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            One post that lands pays for a year of PostPilot. Start free —
            upgrade when it&apos;s working.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-xl border bg-white p-7 transition-all",
                tier.highlighted
                  ? "border-ink shadow-[0_20px_40px_-20px_rgba(15,23,42,0.25)]"
                  : "border-neutral-200",
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-2.5 left-7 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  Most popular
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-semibold text-ink">
                  {tier.name}
                </h3>
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  {tier.name === "Agency" ? "Teams" : "Per seat"}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-neutral-600">
                {tier.description}
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-[-0.02em] text-ink">
                  ${tier.price}
                </span>
                <span className="mb-1.5 text-sm text-neutral-500">
                  {tier.period}
                </span>
              </div>
              <Link href="/auth/signup" className="mt-6">
                <Button
                  className={cn(
                    "w-full",
                    tier.highlighted
                      ? "bg-ink hover:bg-neutral-800"
                      : "",
                  )}
                  variant={tier.highlighted ? "primary" : "secondary"}
                >
                  {tier.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <div className="mt-7 border-t border-neutral-100 pt-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Includes
                </div>
                <ul className="mt-3 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="border-b border-neutral-200/70 bg-white"
    >
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
            Questions, answered.
          </h2>
        </div>
        <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
          {FAQS.map((item, i) => {
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
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500">
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
      </div>
    </section>
  );
}

/* ---------- Creators wall ----------
 *
 * NOTE: photos are placeholder headshots from randomuser.me and profile
 * fields are deterministic placeholders. Before shipping to production,
 * swap CREATOR_PROFILES for opted-in customers with signed releases.
 * The grid + mask + interaction layer doesn't need to change.
 */

const FIRST_NAMES = [
  "Alex", "Maya", "Sam", "Jordan", "Riley", "Casey", "Morgan", "Avery",
  "Quinn", "Drew", "Parker", "Reese", "Cameron", "Skyler", "Rowan", "Sage",
  "Logan", "Phoenix", "River", "Hayden", "Emery", "Blake", "Finley", "Dakota",
];

const LAST_NAMES = [
  "Chen", "Patel", "Kim", "Garcia", "Singh", "Rivera", "Park", "Nguyen",
  "Brooks", "Carter", "Hayes", "Reyes", "Ortiz", "Khan", "Walsh", "Holloway",
  "Bishop", "Wells", "Sharp", "Mercer", "Vance", "Sloan", "Fitch", "Doyle",
];

const NICHES = [
  "Solopreneur",
  "B2B SaaS founder",
  "Design leader",
  "Engineering manager",
  "Growth marketer",
  "Fintech operator",
  "AI researcher",
  "Climate tech founder",
  "Product designer",
  "Brand strategist",
  "Founder coach",
  "Sales leader",
  "Community builder",
  "Content strategist",
  "Operator turned VC",
];

interface CreatorProfile {
  name: string;
  niche: string;
  followers: number;
  avatar: string;
  handle: string;
}

const CREATOR_PROFILES: CreatorProfile[] = Array.from(
  { length: 264 },
  (_, i) => {
    const first = FIRST_NAMES[(i * 5 + 1) % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7 + 3) % LAST_NAMES.length];
    const niche = NICHES[(i * 3 + 1) % NICHES.length];
    const followers = 8_000 + ((i * 1493 + 7) % 312_000);
    const gender = i % 2 === 0 ? "men" : "women";
    const portraitId = (i * 7 + 3) % 99;
    return {
      name: `${first} ${last}`,
      niche,
      followers,
      avatar: `https://randomuser.me/api/portraits/${gender}/${portraitId}.jpg`,
      handle: `${first.toLowerCase()}.${last.toLowerCase()}`,
    };
  },
);

function CreatorsWall() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? CREATOR_PROFILES[activeIdx] : null;

  return (
    <section className="relative overflow-hidden border-b border-neutral-200/70 bg-white">
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        {/* Tile cluster */}
        <div
          className="relative grid gap-1 grid-cols-[repeat(14,minmax(0,1fr))] sm:grid-cols-[repeat(18,minmax(0,1fr))] lg:grid-cols-[repeat(22,minmax(0,1fr))]"
          style={{
            // Donut mask: large hole in the center for the copy, fade at
            // the outer edges so the cluster reads as a soft cloud.
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 65% at center, transparent 0%, transparent 48%, black 68%, black 84%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 50% 65% at center, transparent 0%, transparent 48%, black 68%, black 84%, transparent 100%)",
          }}
        >
          {CREATOR_PROFILES.map((profile, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`View profile of ${profile.name}`}
              className="group relative aspect-square w-full overflow-hidden rounded-[6px] ring-1 ring-inset ring-white/60 transition-transform duration-200 hover:z-10 hover:scale-[1.6] hover:rounded-md hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.4)] hover:ring-2 hover:ring-brand focus:outline-none focus-visible:z-10 focus-visible:scale-[1.6] focus-visible:ring-2 focus-visible:ring-brand"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover grayscale transition-all duration-200 group-hover:grayscale-0 group-focus-visible:grayscale-0"
              />
            </button>
          ))}
        </div>

        {/* Soft white wash behind the copy — guarantees legibility even
            if a few masked tiles bleed into the safe zone. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 38% 45% at center, #ffffff 35%, rgba(255,255,255,0.92) 55%, rgba(255,255,255,0) 80%)",
          }}
        />

        {/* Center copy */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <div className="pointer-events-auto max-w-xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              The creator network
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
              Built for{" "}
              <span className="text-brand">LinkedIn creators.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-neutral-600 sm:text-base">
              Join 12,400+ creators already growing their audience with
              PostPilot. Start your free trial today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-ink hover:bg-neutral-800">
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:sales@postpilot.io">
                <Button size="lg" variant="secondary">
                  Talk to sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {active && (
        <CreatorProfileCard
          profile={active}
          onClose={() => setActiveIdx(null)}
        />
      )}
    </section>
  );
}

function CreatorProfileCard({
  profile,
  onClose,
}: {
  profile: CreatorProfile;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Profile of ${profile.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 animate-fade-in"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close profile"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.4)]">
        {/* Cover band */}
        <div className="relative h-20 bg-gradient-to-br from-brand to-action">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <Minus className="h-3.5 w-3.5 rotate-45" />
          </button>
        </div>

        {/* Avatar */}
        <div className="-mt-10 px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-3">
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">
            {profile.name}
          </h3>
          <p className="mt-0.5 text-sm text-neutral-600">{profile.niche}</p>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200">
            <div className="bg-white p-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Followers
              </div>
              <div className="mt-0.5 text-base font-semibold tabular-nums text-ink">
                {profile.followers >= 1000
                  ? `${(profile.followers / 1000).toFixed(1)}k`
                  : profile.followers}
              </div>
            </div>
            <div className="bg-white p-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Plan
              </div>
              <div className="mt-0.5 text-base font-semibold tracking-[-0.01em] text-ink">
                Pro
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-neutral-600">
            Uses PostPilot to ship{" "}
            <span className="font-medium text-ink">4 posts a week</span> and
            grows by ~
            <span className="font-medium text-ink">
              {Math.round(profile.followers * 0.018).toLocaleString()}
            </span>{" "}
            followers/month.
          </p>

          <a
            href={`https://www.linkedin.com/in/${profile.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Linkedin className="h-3.5 w-3.5" />
            View on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- CTA ---------- */
function CtaBanner() {
  return (
    <section className="bg-[#FAFAF9]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-ink p-10 text-center sm:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-action/30 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
              Write less. Reach more.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
              Set up takes under two minutes. Your first post is live tonight.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-ink hover:bg-white/90"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  See pricing
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-neutral-600">
              The unfair advantage for LinkedIn creators. Built on Claude.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["Features", "#features"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["Contact", "/contact"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
            ]}
          />
          <FooterCol
            title="Connect"
            links={[
              ["Twitter", "https://twitter.com/postpilot"],
              ["LinkedIn", "https://linkedin.com/company/postpilot"],
            ]}
          />
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row">
          <span>© 2026 PostPilot. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/postpilot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-neutral-400 transition-colors hover:text-ink"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/company/postpilot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-400 transition-colors hover:text-ink"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-neutral-700 transition-colors hover:text-ink"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Primitives ---------- */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
      <span className="h-px w-6 bg-neutral-300" />
      {children}
      <span className="h-px w-6 bg-neutral-300" />
    </div>
  );
}
