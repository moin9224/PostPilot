export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-ink">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-neutral-600">
            Last updated: December 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-neutral max-w-none space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-ink">1. Agreement to Terms</h2>
            <p className="text-neutral-700 leading-relaxed">
              By accessing and using PostPilot ("the Service"), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-ink">2. Use License</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot grants you a limited license to access and use the Service for your personal, non-commercial use.
              This license does not include:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose</li>
              <li>Attempting to reverse engineer any software</li>
              <li>Removing any copyright or proprietary notations</li>
              <li>Transferring the materials to another person</li>
              <li>Using automated tools to access the Service</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-ink">3. Disclaimer of Warranties</h2>
            <p className="text-neutral-700 leading-relaxed">
              The materials on PostPilot are provided on an "as is" basis. PostPilot makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
            <p className="text-neutral-700 leading-relaxed mt-3">
              PostPilot does not warrant that the Service will be uninterrupted, error-free, or completely secure.
            </p>
          </section>

          {/* Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-ink">4. Limitations of Liability</h2>
            <p className="text-neutral-700 leading-relaxed">
              In no event shall PostPilot or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on PostPilot, even if PostPilot or an authorized representative has been notified
              orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Accuracy of Materials */}
          <section>
            <h2 className="text-2xl font-bold text-ink">5. Accuracy of Materials</h2>
            <p className="text-neutral-700 leading-relaxed">
              The materials appearing on PostPilot could include technical, typographical, or photographic errors.
              PostPilot does not warrant that any of the materials on the Service are accurate, complete, or current.
              PostPilot may make changes to the materials contained on the Service at any time without notice.
            </p>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-2xl font-bold text-ink">6. Links</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot has not reviewed all of the sites linked to the Service and is not responsible for the contents
              of any such linked site. The inclusion of any link does not imply endorsement by PostPilot of the site.
              Use of any such linked website is at the user's own risk.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-ink">7. Modifications</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot may revise these terms of service for the Service at any time without notice. By using this
              service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-ink">8. Governing Law</h2>
            <p className="text-neutral-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the United States,
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-ink">9. User Accounts</h2>
            <p className="text-neutral-700 leading-relaxed">
              When you create an account with PostPilot, you must provide information that is accurate, complete,
              and current at all times. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Maintaining the confidentiality of your account information and password</li>
              <li>Accepting responsibility for all activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Not using another person's account without permission</li>
            </ul>
          </section>

          {/* Content Responsibility */}
          <section>
            <h2 className="text-2xl font-bold text-ink">10. Content Responsibility</h2>
            <p className="text-neutral-700 leading-relaxed">
              You are responsible for any content you create, generate, or upload through PostPilot. You agree that:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>You own or have permission to use all content</li>
              <li>Content does not violate any laws or third-party rights</li>
              <li>Content is not defamatory, obscene, or harmful</li>
              <li>You will not post spam, malware, or illegal content</li>
              <li>You are solely responsible for any consequences of posting content</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-ink">11. Prohibited Activities</h2>
            <p className="text-neutral-700 leading-relaxed">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Hacking, reverse engineering, or attempting to breach security</li>
              <li>Transmitting malware, viruses, or harmful code</li>
              <li>Scraping or data mining the Service</li>
              <li>Violating any laws or regulations</li>
              <li>Impersonating other users or entities</li>
              <li>Spam or unsolicited communications</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-ink">12. Intellectual Property Rights</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot owns or licenses all intellectual property in the Service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Software, code, and technology</li>
              <li>Logos, trademarks, and brand names</li>
              <li>Written content and documentation</li>
              <li>User interface and design</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              You may not reproduce, distribute, or transmit the Service or its content without permission.
            </p>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-ink">13. Payment Terms</h2>
            <p className="text-neutral-700 leading-relaxed">
              If you choose a paid plan, you agree to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Provide accurate payment information</li>
              <li>Pay all charges incurred under your account</li>
              <li>Authorize charges to your payment method</li>
              <li>Comply with all billing policies</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              Pricing is subject to change with 30 days' notice. Subscription renewals will be charged automatically
              unless canceled before the renewal date.
            </p>
          </section>

          {/* Cancellation */}
          <section>
            <h2 className="text-2xl font-bold text-ink">14. Cancellation</h2>
            <p className="text-neutral-700 leading-relaxed">
              You may cancel your subscription at any time through your account settings or by contacting us.
              Cancellation becomes effective at the end of the current billing cycle. We do not provide refunds
              for partial months.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-ink">15. Termination</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot reserves the right to terminate or suspend your account at any time for:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Violation of these Terms and Conditions</li>
              <li>Illegal activity or harmful conduct</li>
              <li>Non-payment of fees</li>
              <li>Abuse of the Service</li>
              <li>Any reason at our discretion</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-ink">16. Indemnification</h2>
            <p className="text-neutral-700 leading-relaxed">
              You agree to indemnify and hold harmless PostPilot from any claims, damages, or costs arising from:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2 mt-3">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your content or actions</li>
              <li>Infringement claims related to your content</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-ink">17. Third-Party Services</h2>
            <p className="text-neutral-700 leading-relaxed">
              PostPilot integrates with third-party services (LinkedIn, Google, Stripe, etc.). Your use of these
              services is governed by their terms. PostPilot is not responsible for third-party service availability,
              errors, or policy changes.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-ink">18. Contact Information</h2>
            <p className="text-neutral-700 leading-relaxed">
              If you have questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg mt-3 text-neutral-700">
              <p><strong>Email:</strong> support@postpilot.io</p>
              <p><strong>Website:</strong> https://thepostpilot.vercel.app</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
