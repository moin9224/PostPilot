import Link from "next/link";
import { ArrowLeft, Sparkles, Quote } from "lucide-react";
import Logo from "@/components/Common/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#FAFAF9] lg:grid-cols-2">
      {/* Form column */}
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <p className="text-center text-[11px] text-neutral-400">
          © 2026 PostPilot ·{" "}
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </p>
      </div>

      {/* Visual column */}
      <div className="relative hidden overflow-hidden border-l border-neutral-200 bg-ink lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-action/30 blur-3xl"
        />

        <div className="relative flex flex-1 flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            <Sparkles className="h-3 w-3" />
            Built on Claude
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <Quote className="h-5 w-5 text-white/30" />
              <p className="mt-3 text-lg font-medium leading-snug tracking-[-0.01em]">
                PostPilot replaced four tools and a freelancer. Our inbound
                doubled in a quarter.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-action" />
                <div>
                  <div className="text-sm font-semibold">Maya Chen</div>
                  <div className="text-xs text-white/60">
                    Head of Marketing, Northwind
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
              {[
                ["12,400+", "Creators"],
                ["3.4M", "Posts"],
                ["+182%", "Reach lift"],
              ].map(([value, label]) => (
                <div key={label} className="bg-ink p-4 text-center">
                  <div className="text-lg font-semibold tracking-[-0.01em]">
                    {value}
                  </div>
                  <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40">
            Used by creators at Vercel, Linear, Notion, Figma and 12,000+ others.
          </p>
        </div>
      </div>
    </div>
  );
}
