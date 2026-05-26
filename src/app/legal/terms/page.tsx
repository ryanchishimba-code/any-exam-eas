import { LEGAL_DISCLAIMERS } from "@/lib/legal";

export const metadata = { title: "Terms of Service — Any Exam Easy" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <section>
        <h2>1. Agreement</h2>
        <p>
          By accessing Any Exam Easy (&quot;Service&quot;), you agree to these Terms. If you do not
          agree, do not use the Service. You must be at least 18 years old.
        </p>
      </section>
      <section>
        <h2>2. Beta</h2>
        <p>{LEGAL_DISCLAIMERS.beta}</p>
      </section>
      <section>
        <h2>3. Service description</h2>
        <p>{LEGAL_DISCLAIMERS.educationalPurpose}</p>
      </section>
      <section>
        <h2>3. Subscriptions</h2>
        <p>{LEGAL_DISCLAIMERS.subscription}</p>
        <p className="mt-2">
          You may cancel before renewal through the billing portal. Fees are non-refundable
          except where required by law.
        </p>
      </section>
      <section>
        <h2>4. User conduct</h2>
        <p>{LEGAL_DISCLAIMERS.userResponsibility}</p>
      </section>
      <section>
        <h2>5. Disclaimer of warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT.
        </p>
      </section>
      <section>
        <h2>6. Limitation of liability</h2>
        <p>{LEGAL_DISCLAIMERS.limitationOfLiability}</p>
      </section>
      <section>
        <h2>7. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Any Exam Easy and its operators from claims
          arising from your use of the Service, violation of these Terms, or misuse of
          generated content.
        </p>
      </section>
      <section>
        <h2>8. Changes</h2>
        <p>
          We may update these Terms. Continued use after changes constitutes acceptance.
          Material changes will be communicated via email associated with your account.
        </p>
      </section>
      <p className="text-xs text-[var(--color-ink-muted)]">
        This document is a template. Have a licensed attorney review before going live.
      </p>
    </LegalPage>
  );
}

function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="prose-legal mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--color-ink-muted)] [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[var(--color-ink)]">
          {children}
        </div>
      </article>
    </div>
  );
}
