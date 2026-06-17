import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, Sparkles, Target, Users, Zap } from "lucide-react";
import MarketingShell from "@/components/Marketing/MarketingShell";
import Button from "@/components/Common/Button";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Creators first",
      body: "Every decision starts with one question: does this help a creator grow faster? If not, we don't ship it.",
    },
    {
      icon: Zap,
      title: "Speed as a feature",
      body: "A post idea at 7 AM needs to be live by 9 AM. We obsess over removing every second of friction.",
    },
    {
      icon: Users,
      title: "Built in public",
      body: "Our roadmap is shaped by the creators using PostPilot daily, not internal guesses about what they need.",
    },
  ];

  const stats = [
    { value: "2023", label: "Founded" },
    { value: "12,400+", label: "Active creators" },
    { value: "3.4M", label: "Posts shipped" },
    { value: "100%", label: "Remote team" },
  ];

  const team = [
    { name: "Maya Chen", role: "Co-founder & CEO", bio: "Former LinkedIn product lead. Built creator tools used by 2M+ people." },
    { name: "Alex Rivera", role: "Co-founder & CTO", bio: "Ex-Figma engineer. Obsessed with making AI outputs actually sound human." },
    { name: "Sam Park", role: "Head of Growth", bio: "Scaled two B2B SaaS products from 0 to $5M ARR. LinkedIn power user since 2016." },
    { name: "Kira Holloway", role: "Head of Design", bio: "Previously at Linear and Notion. Believes great design is invisible." },
  ];

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Our story
            </span>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              We got tired of staring at blank pages too.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
              PostPilot started as a personal tool. We were LinkedIn creators who spent more time figuring out what to post than actually posting. So we built the thing we wished existed. 12,000 creators joined us.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button className="bg-ink hover:bg-neutral-800">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary">Talk to the team</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-8 py-10 text-center">
                <div className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">{s.value}</div>
                <div className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Mission</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
                Give every creator an unfair advantage.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                The best ideas don&apos;t always reach the most people. Not because they&apos;re bad ideas. The creator behind them simply ran out of time, confidence, or consistency.
              </p>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                PostPilot levels the playing field. Whether you post once a week or every day, whether you have 500 followers or 500,000, you get the same intelligent drafting, smart scheduling, and clear analytics that the biggest names in your niche use.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { icon: Sparkles, label: "AI drafting in your voice" },
                { icon: CalendarClock, label: "Peak-time scheduling" },
                { icon: BarChart3, label: "Clear reach analytics" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Values</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
              What we stand for.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-neutral-200 bg-[#FAFAF9] p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Team</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
              The people behind PostPilot.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => {
              const gradients = [
                "from-brand to-action",
                "from-action to-violet-500",
                "from-amber-400 to-rose-500",
                "from-emerald-400 to-teal-500",
              ];
              return (
                <div key={member.name} className="rounded-xl border border-neutral-200 bg-white p-6">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${gradients[i]} flex items-center justify-center text-xl font-semibold text-white`}>
                    {member.name[0]}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{member.name}</h3>
                  <p className="text-xs font-medium text-brand">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{member.bio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-ink p-10 text-center sm:p-16">
            <div aria-hidden className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/30 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-action/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                Ready to grow your audience?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
                Join 12,400+ creators who post consistently and grow every week.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white !text-ink hover:bg-white/90">
                    Start free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10">
                    Talk to sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
