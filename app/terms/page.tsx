import MarketingShell from "@/components/Marketing/MarketingShell";

const SECTIONS = [
  {
    title: "Agreement",
    body: `By accessing or using PostPilot, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service. These terms apply to all users, including visitors, registered users, and paying subscribers.`,
  },
  {
    title: "Eligibility",
    body: `You must be at least 16 years old to use PostPilot. By using the platform, you confirm that you meet this requirement and that any information you provide is accurate. If you are using PostPilot on behalf of a business, you confirm you have authority to bind that business to these terms.`,
  },
  {
    title: "Your account",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at hello@postpilot.io if you suspect unauthorised access. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: "Acceptable use",
    body: `PostPilot is for legitimate content creation and scheduling. You agree not to use PostPilot to send spam, publish illegal or harmful content, impersonate others, scrape or reverse-engineer our platform, circumvent LinkedIn's terms of service, or engage in any activity that could damage, disable, or impair our service.`,
  },
  {
    title: "LinkedIn integration",
    body: `PostPilot integrates with LinkedIn via its official API. You are responsible for complying with LinkedIn's own terms of service at all times. We are not responsible for any account restrictions or bans LinkedIn applies to your profile, and cannot guarantee that LinkedIn's API or policies will remain unchanged.`,
  },
  {
    title: "Intellectual property",
    body: `The content you create using PostPilot is yours. We claim no ownership over your posts, drafts, or ideas. PostPilot and its underlying technology, design, and trademarks remain the property of PostPilot Inc. You may not copy, redistribute, or create derivative works from our platform without our written permission.`,
  },
  {
    title: "AI-generated content",
    body: `PostPilot uses AI to assist you in drafting content. You are solely responsible for reviewing and approving all content before publishing. We do not guarantee that AI-generated drafts are accurate, appropriate, or free from errors. Published content is your responsibility.`,
  },
  {
    title: "Payments and billing",
    body: `Paid plans are billed in advance on a monthly or annual basis. All payments are non-refundable except where required by law. You may cancel your subscription at any time; cancellation takes effect at the end of your current billing period. Prices may change with 30 days' notice.`,
  },
  {
    title: "Limitation of liability",
    body: `To the maximum extent permitted by law, PostPilot is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability for any claim is limited to the amount you paid us in the three months preceding the claim.`,
  },
  {
    title: "Disclaimers",
    body: `PostPilot is provided "as is" without warranties of any kind. We do not warrant that the service will be uninterrupted, error-free, or that any defects will be corrected. We make no guarantees about follower growth, reach, or engagement results.`,
  },
  {
    title: "Termination",
    body: `You may stop using PostPilot at any time. We may suspend or terminate your access if you violate these terms, with or without notice. Upon termination, your right to use the service ceases immediately. Sections on intellectual property, limitation of liability, and governing law survive termination.`,
  },
  {
    title: "Changes to these terms",
    body: `We may update these terms from time to time. We will notify you of material changes by email or prominent notice at least 14 days in advance. Continued use after changes take effect constitutes acceptance of the revised terms.`,
  },
  {
    title: "Governing law",
    body: `These terms are governed by the laws of [Jurisdiction]. Any disputes will be resolved in the courts of [Jurisdiction]. If any provision of these terms is found unenforceable, the remaining provisions continue in full force.`,
  },
  {
    title: "Contact",
    body: `Questions about these terms? Email legal@postpilot.io or write to PostPilot Inc., [Address], [City, Country].`,
  },
];

export default function TermsPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Legal</span>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Please read these carefully. By using PostPilot, you agree to the terms below. Last updated <strong className="text-ink">June 2026</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            {/* Sticky nav */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.title}
                    href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block rounded-md px-3 py-1.5 text-[13px] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-ink"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Body */}
            <div className="max-w-2xl space-y-12">
              {SECTIONS.map((s) => (
                <section key={s.title} id={s.title.toLowerCase().replace(/\s+/g, "-")}>
                  <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink">{s.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{s.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
