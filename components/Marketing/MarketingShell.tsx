"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Linkedin, Twitter } from "lucide-react";
import Logo from "@/components/Common/Logo";
import Button from "@/components/Common/Button";
import { cn } from "@/lib/utils";

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-ink antialiased">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-[#FAFAF9]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <Link href="/#features" className="transition-colors hover:text-ink">Product</Link>
          <Link href="/#workflow" className="transition-colors hover:text-ink">How it works</Link>
          <Link href="/#pricing" className="transition-colors hover:text-ink">Pricing</Link>
          <Link href="/contact" className="transition-colors hover:text-ink">Contact</Link>
        </nav>
        <div className="hidden items-center gap-1.5 sm:flex">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-ink hover:bg-neutral-800">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="sm:hidden rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1 text-sm text-neutral-700">
            <Link href="/#features" onClick={() => setMobileOpen(false)} className="py-2">Product</Link>
            <Link href="/#workflow" onClick={() => setMobileOpen(false)} className="py-2">How it works</Link>
            <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="py-2">Pricing</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2">Contact</Link>
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

function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* Brand + CTA strip */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo light />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              The unfair advantage for LinkedIn creators who want to grow without burning out.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link href="/auth/signup">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90">
                Start free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <span className="text-[12px] text-white/30">7 days free · No credit card</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-4">
          <FooterCol title="Product" links={[["Features","/#features"],["How it works","/#workflow"],["Pricing","/#pricing"],["FAQ","/faq"]]} />
          <FooterCol title="Company" links={[["About","/about"],["Contact","/contact"],["Blog","#"],["Careers","#"]]} />
          <FooterCol title="Legal" links={[["Privacy","/privacy"],["Terms","/terms"],["Cookies","#"]]} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">Connect</p>
            <div className="mt-4 flex gap-2.5">
              <a href="https://twitter.com/postpilot" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white">
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a href="https://linkedin.com/company/postpilot" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-[12px] text-white/30 sm:flex-row">
          <span>© 2026 PostPilot, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white/60">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-white/60">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{title}</div>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sm text-white/60 transition-colors hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
