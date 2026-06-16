export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-ink">
            Privacy Policy
          </h1>
          <p className="mt-2 text-neutral-600">
            Last updated: December 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-neutral max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-ink">Introduction</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot ("we," "us," "our," or "Company") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website and use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-ink">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-ink">1.1 Information You Provide</h3>
                <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-2">
                  <li><strong>Account Information:</strong> Email, password, name, company, industry</li>
                  <li><strong>Profile Information:</strong> Profile picture, headline, biography</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method (processed via Stripe)</li>
                  <li><strong>Content:</strong> Posts, drafts, analytics data you create or generate</li>
                  <li><strong>LinkedIn Data:</strong> Posts, followers, engagement metrics (with your authorization)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-ink mt-4">1.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-2">
                  <li><strong>Usage Data:</strong> Pages visited, time spent, features used, clicks</li>
                  <li><strong>Device Information:</strong> Browser type, IP address, device type, operating system</li>
                  <li><strong>Cookies:</strong> Session cookies, analytics cookies, authentication cookies</li>
                  <li><strong>Analytics:</strong> Google Analytics, Supabase analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-ink mt-4">1.3 Third-Party Information</h3>
                <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-2">
                  <li><strong>LinkedIn:</strong> Profile data, posts, metrics (with OAuth consent)</li>
                  <li><strong>Google:</strong> Account data (with OAuth consent)</li>
                  <li><strong>Payment Processors:</strong> Stripe (for payment processing)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-ink">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2">
              <li>To provide, maintain, and improve our Services</li>
              <li>To process payments and send billing information</li>
              <li>To send important notifications about changes to our Services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To personalize your experience and deliver relevant content</li>
              <li>To monitor and analyze trends, usage, and activities</li>
              <li>To detect and prevent fraudulent transactions and other illegal activities</li>
              <li>To comply with legal obligations and enforce our Terms</li>
              <li>For marketing purposes (with your consent)</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-ink">3. Data Security</h2>
            <p className="text-neutral-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. These include:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure password hashing with bcrypt</li>
              <li>Row Level Security (RLS) in our database</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              However, no security system is impenetrable. While we strive to protect your information,
              we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-ink">4. Data Retention</h2>
            <p className="text-neutral-700 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide Services.
              You can request deletion of your account and associated data at any time by contacting us at
              <span className="font-semibold"> support@postpilot.io</span>.
            </p>
            <p className="text-neutral-700 leading-relaxed mt-3">
              We may retain certain information for legal compliance, fraud prevention, and legitimate business purposes
              even after account deletion.
            </p>
          </section>

          {/* Sharing Information */}
          <section>
            <h2 className="text-2xl font-bold text-ink">5. Sharing Your Information</h2>
            <p className="text-neutral-700 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share information in these cases:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li><strong>Service Providers:</strong> Third parties who assist us (Supabase, Stripe, email services)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
              <li><strong>With Your Consent:</strong> For any other purpose with your explicit permission</li>
            </ul>
          </section>

          {/* LinkedIn Integration */}
          <section>
            <h2 className="text-2xl font-bold text-ink">6. LinkedIn Integration</h2>
            <p className="text-neutral-700 leading-relaxed">
              When you connect your LinkedIn account, we request permission to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Access your profile information</li>
              <li>Read your posts and engagement metrics</li>
              <li>Publish posts on your behalf</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              Your LinkedIn access token is encrypted and stored securely. You can revoke access at any time
              through your LinkedIn account settings or our Settings page. We will not access LinkedIn data after revocation.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-ink">7. Your Rights</h2>
            <p className="text-neutral-700 leading-relaxed">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request corrections to inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              To exercise these rights, contact us at <span className="font-semibold">support@postpilot.io</span>.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-ink">8. Cookies and Tracking</h2>
            <p className="text-neutral-700 leading-relaxed">
              We use cookies for:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li><strong>Authentication:</strong> Keeping you logged in</li>
              <li><strong>Analytics:</strong> Understanding how you use our Services</li>
              <li><strong>Performance:</strong> Improving site speed and functionality</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              You can control cookies through your browser settings. Disabling cookies may affect functionality.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-ink">9. Contact Us</h2>
            <p className="text-neutral-700 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg mt-3 text-neutral-700">
              <p><strong>Email:</strong> support@postpilot.io</p>
              <p><strong>Website:</strong> https://thepostpilot.vercel.app</p>
            </div>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold text-ink">10. Changes to This Policy</h2>
            <p className="text-neutral-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by
              posting the new policy on this page and updating the "Last updated" date. Your continued use of the
              Services constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
