import MarketingShell from "@/components/Marketing/MarketingShell";

const SECTIONS = [
  {
    title: "Introduction",
    body: `PostPilot ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using PostPilot, you agree to the practices described here.`,
  },
  {
    title: "Information we collect",
    body: `We collect information you provide directly (such as your name, email address, and LinkedIn account data) when you create an account or connect your social profiles. We also collect usage data automatically, including pages visited, features used, and device information, to improve our service.`,
  },
  {
    title: "How we use your information",
    body: `We use your information to provide and improve PostPilot, personalise your experience, generate AI-assisted content in your voice, send you product updates and marketing communications (which you can opt out of at any time), and comply with legal obligations.`,
  },
  {
    title: "LinkedIn data",
    body: `When you connect your LinkedIn account, we access only the permissions you explicitly grant. We use this access to publish scheduled posts and retrieve performance analytics on your behalf. We never store your LinkedIn password, and you can revoke access at any time from your LinkedIn settings or from within PostPilot.`,
  },
  {
    title: "Sharing your information",
    body: `We do not sell your personal data. We may share it with trusted service providers who help us operate PostPilot (such as cloud infrastructure, payment processors, and analytics tools), all of whom are bound by confidentiality agreements. We may also disclose information if required by law or to protect the rights and safety of our users.`,
  },
  {
    title: "Data retention",
    body: `We retain your data for as long as your account is active or as needed to provide our services. You may request deletion of your account and associated data at any time by contacting us at privacy@postpilot.io. We will process your request within 30 days.`,
  },
  {
    title: "Security",
    body: `We implement industry-standard security measures including encryption in transit and at rest, regular security audits, and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. We take every reasonable precaution.`,
  },
  {
    title: "Cookies",
    body: `We use essential cookies to keep you logged in and remember your preferences, and analytics cookies to understand how PostPilot is used. You can control cookie settings through your browser. Disabling cookies may limit some features of the platform.`,
  },
  {
    title: "Your rights",
    body: `Depending on your location, you may have rights to access, correct, delete, or export your personal data. To exercise any of these rights, contact us at privacy@postpilot.io. We will respond within 30 days.`,
  },
  {
    title: "Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or by a prominent notice on our platform at least 14 days before the change takes effect. Continued use of PostPilot after changes constitutes your acceptance of the revised policy.`,
  },
  {
    title: "Contact us",
    body: `Questions about this policy? Email us at privacy@postpilot.io or write to us at PostPilot Inc., [Address], [City, Country].`,
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="border-b border-neutral-200/70 bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Legal</span>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              We keep this plain English. No legal jargon, no hidden catches. Last updated <strong className="text-ink">June 2026</strong>.
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
