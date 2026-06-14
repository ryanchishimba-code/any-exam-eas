import { LEGAL_DISCLAIMERS, LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata = { title: "Terms of Service — Any Exam Easy" };

export default function TermsPage() {
  const { companyName, productName, supportEmail, legalEmail } = LEGAL_ENTITY;

  return (
    <LegalPage title="Terms of Service" lastUpdated={LEGAL_LAST_UPDATED}>
      <section>
        <h2>1. Agreement and parties</h2>
        <p>{LEGAL_DISCLAIMERS.companyRelationship}</p>
        <p className="mt-2">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the{" "}
          {productName} website, applications, and related services (collectively, the
          &quot;Service&quot;). By creating an account, subscribing, or using the Service, you
          agree to these Terms, our{" "}
          <a href="/legal/privacy" className="text-[var(--color-accent)] underline">
            Privacy Policy
          </a>
          , and our{" "}
          <a href="/legal/disclaimer" className="text-[var(--color-accent)] underline">
            Disclaimers
          </a>
          . If you do not agree, do not use the Service.
        </p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.ageRequirement}</p>
      </section>

      <section>
        <h2>2. Service description</h2>
        <p>{LEGAL_DISCLAIMERS.educationalPurpose}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.noGuarantee}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.notMedicalAdvice}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.aiGenerated}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.progressMetrics}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.studySupport}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.testimonials}</p>
      </section>

      <section>
        <h2>3. Accounts and eligibility</h2>
        <p>
          You must provide accurate registration information and keep your credentials secure. You
          are responsible for activity under your account. One person may not share login credentials
          except as expressly permitted by the Service. We may suspend or terminate accounts that
          violate these Terms, pose security risks, or are used for fraud or abuse.
        </p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.reactivation}</p>
      </section>

      <section>
        <h2>4. Subscriptions, billing, and payments</h2>
        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.1 Free trial and signup</h3>
        <p className="mt-2">{LEGAL_DISCLAIMERS.subscription}</p>
        <p className="mt-2">
          A valid payment method is required to start a free trial. Unless separate introductory
          pricing is expressly disclosed at checkout, you are not charged when you sign up; your
          saved payment method is charged when the trial period ends unless you cancel before the
          trial ends. Free trials are limited to one per email address unless we authorize
          otherwise in writing.
        </p>

        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.2 Recurring billing and auto-renewal</h3>
        <p className="mt-2">
          Paid subscriptions renew automatically at the then-current rate for the billing interval
          you selected (for example, monthly, every three months, every six months, or yearly)
          until canceled. By subscribing, you authorize {companyName} and its payment processor to
          charge your saved payment method on a recurring basis. You may update your payment method
          or cancel renewal through Settings and the Stripe customer billing portal.
        </p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.stripeProcessor}</p>

        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.3 Refunds and access after cancellation</h3>
        <p className="mt-2">{LEGAL_DISCLAIMERS.refundsAndAccess}</p>

        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.4 Plan changes</h3>
        <p className="mt-2">{LEGAL_DISCLAIMERS.planChanges}</p>

        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.5 Payment failure</h3>
        <p className="mt-2">{LEGAL_DISCLAIMERS.paymentFailure}</p>
        <p className="mt-2">
          If payment cannot be collected, premium study features may be suspended immediately until
          payment is successfully processed. You remain responsible for amounts owed.
        </p>

        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.6 Billing communications</h3>
        <p className="mt-2">{LEGAL_DISCLAIMERS.billingCommunications}</p>

        <h3 className="mt-4 font-semibold text-[var(--color-ink)]">4.7 Price changes</h3>
        <p className="mt-2">
          We may change subscription prices or plans. Price changes apply to subsequent billing
          periods after notice via email, in-app notice, or updated pricing pages, except where
          applicable law requires otherwise. Continued use after the effective date constitutes
          acceptance of new pricing for renewal periods.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <p>{LEGAL_DISCLAIMERS.userResponsibility}</p>
        <p className="mt-2">
          You may not reverse engineer, scrape, resell, or redistribute Service content; attempt
          unauthorized access; interfere with the Service; use the Service to cheat on live exams
          or violate academic or professional rules; or use the Service in violation of applicable
          law. We may investigate and cooperate with authorities regarding misuse.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          The Service, including software, branding, question banks, UI, and documentation, is
          owned by {companyName} or its licensors and protected by intellectual property laws. We
          grant you a limited, non-exclusive, non-transferable, revocable license to access and use
          the Service for personal, non-commercial study while your subscription is active and in
          good standing. You retain ownership of content you submit; you grant us a license to
          host, process, and display it as needed to operate the Service.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer of warranties</h2>
        <p>
          THE SERVICE AND ALL CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY,
          NON-INFRINGEMENT, OR THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. NO
          ADVICE OR INFORMATION FROM {companyName.toUpperCase()} OR THE SERVICE CREATES ANY
          WARRANTY NOT EXPRESSLY STATED HERE.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>{LEGAL_DISCLAIMERS.limitationOfLiability}</p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.liabilityCap}</p>
        <p className="mt-2">
          Some jurisdictions do not allow certain limitations; in those jurisdictions, our
          liability is limited to the maximum extent permitted by law.
        </p>
      </section>

      <section>
        <h2>9. Indemnification</h2>
        <p>{LEGAL_DISCLAIMERS.indemnification}</p>
      </section>

      <section>
        <h2>10. Dispute resolution; binding arbitration; class action waiver</h2>
        <p>
          <strong>Informal resolution first.</strong> Before filing a claim, you agree to contact us
          at {legalEmail} and attempt to resolve the dispute informally for at least thirty (30)
          days.
        </p>
        <p className="mt-2">
          <strong>Binding arbitration.</strong> Except for individual claims in small claims court
          or for injunctive relief relating to intellectual property or unauthorized access, any
          dispute arising out of or relating to these Terms or the Service shall be resolved by
          binding arbitration on an individual basis, not in court, under the rules of the American
          Arbitration Association (AAA) or JAMS, as selected by the Company. The arbitrator may
          award the same damages and relief a court could award on an individual basis. Judgment on
          the award may be entered in any court of competent jurisdiction.
        </p>
        <p className="mt-2">{LEGAL_DISCLAIMERS.noClassAction}</p>
        <p className="mt-2">
          <strong>Opt-out.</strong> You may opt out of arbitration within thirty (30) days of
          first accepting these Terms by emailing {legalEmail} with your name, account email, and
          a clear statement that you opt out of arbitration.
        </p>
      </section>

      <section>
        <h2>11. Governing law</h2>
        <p>{LEGAL_DISCLAIMERS.governingLawSummary}</p>
        <p className="mt-2">
          The Federal Arbitration Act governs the interpretation and enforcement of the arbitration
          agreement in Section 10.
        </p>
      </section>

      <section>
        <h2>12. Termination</h2>
        <p>
          You may stop using the Service and cancel your subscription at any time through Settings.
          We may suspend or terminate access immediately for violation of these Terms, non-payment,
          fraud, or to protect the Service or other users. Sections that by nature should survive
          termination (including payment obligations, disclaimers, limitation of liability,
          indemnification, and dispute resolution) survive.
        </p>
      </section>

      <section>
        <h2>13. Changes to these Terms</h2>
        <p>
          We may modify these Terms from time to time. We will post the updated Terms and revise
          the &quot;Last updated&quot; date. Material changes will be communicated via email to
          the address associated with your account or through in-app notice. Continued use after the
          effective date constitutes acceptance unless applicable law requires otherwise.
        </p>
      </section>

      <section>
        <h2>14. Miscellaneous</h2>
        <p>
          <strong>Force majeure.</strong> We are not liable for delays or failures caused by events
          beyond our reasonable control.
        </p>
        <p className="mt-2">
          <strong>Severability.</strong> If any provision is held invalid, the remaining provisions
          remain in effect.
        </p>
        <p className="mt-2">
          <strong>Entire agreement.</strong> These Terms, the Privacy Policy, and Disclaimers are
          the entire agreement between you and {companyName} regarding the Service.
        </p>
        <p className="mt-2">
          <strong>Assignment.</strong> You may not assign these Terms without our consent. We may
          assign these Terms in connection with a merger, acquisition, or sale of assets.
        </p>
        <p className="mt-2">
          <strong>Contact.</strong> Questions about these Terms: {legalEmail}. Account and billing
          support: {supportEmail}.
        </p>
      </section>

      <p className="text-xs text-[var(--color-ink-muted)]">
        These Terms are provided for operational transparency. They are not legal advice. Have a
        licensed attorney in your jurisdiction review them before relying on them for compliance
        with consumer protection, auto-renewal, or professional-education regulations.
      </p>
    </LegalPage>
  );
}

function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="prose-legal mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          Last updated: {lastUpdated} · {LEGAL_ENTITY.productName} is a product of{" "}
          {LEGAL_ENTITY.companyName}
        </p>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--color-ink-muted)] [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[var(--color-ink)] [&_h3]:text-sm">
          {children}
        </div>
      </article>
    </div>
  );
}
