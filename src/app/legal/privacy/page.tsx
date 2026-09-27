import type { Metadata } from "next";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — Any Exam Easy" },
  description:
    "Read the Any Exam Easy Privacy Policy — how we collect, use and protect account data for NCLEX, USMLE and multi-exam board prep students today.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  const { companyName, productName, supportEmail, legalEmail, productDomain } = LEGAL_ENTITY;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          Last updated: {LEGAL_LAST_UPDATED} · {productName} is a product of {companyName}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Who we are</h2>
            <p className="mt-2">{LEGAL_DISCLAIMERS.companyRelationship}</p>
            <p className="mt-2">
              {companyName} is the data controller for personal information collected through{" "}
              {productDomain} and the {productName} Service. Contact: {legalEmail}.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Information we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account data: email, name, date of birth (age verification), password hash</li>
              <li>Study activity: exam attempts, progress, preferences, generated content</li>
              <li>
                Pass check-in answers (passed, didn&apos;t pass, haven&apos;t taken it, or dismissed)
                and optional quotes you choose to share
              </li>
              <li>Testimonials you submit for the site</li>
              <li>Feedback-form messages</li>
              <li>
                Question reports: the item, the answer you selected, and the reason you send
              </li>
              <li>
                IP address and browser details stored with the consent snapshot recorded at signup
              </li>
              <li>Billing data: subscription status, plan interval, payment metadata processed by Stripe (we do not store full card numbers)</li>
              <li>Technical data: IP address, device/browser type, logs, and cookies needed to operate and secure the Service</li>
              <li>Communications: support messages and transactional emails we send you</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">How we use data</h2>
            <p className="mt-2">
              To provide and improve the Service; generate AI study content; track progress;
              process subscriptions and reactivations; send account, billing, and security notices
              (including trial-ending and renewal reminders approximately 24 hours before a charge,
              and payment-failure alerts); prevent fraud and abuse; and comply with law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Third-party processors</h2>
            <p className="mt-2">
              We use service providers that process data on our behalf, including Stripe (payments),
              Resend or similar providers (transactional email), OpenAI and other model providers (content
              generation), hosting and database providers, and analytics or search tools where enabled.
              Each receives only data necessary for its function and is subject to contractual
              obligations where applicable.
            </p>
            <p className="mt-2">
              AI Tutor and study inputs may be sent to OpenAI to generate responses. That includes
              the question stem, the choices, the answer you selected, and study-plan inputs such as
              weak topics when you open AI Tutor on NCLEX, NAPLEX, or USMLE.
            </p>
            <p className="mt-2">
              We do not sell or share personal information for targeted advertising.
            </p>
            <p className="mt-2">{LEGAL_DISCLAIMERS.stripeProcessor}</p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Retention</h2>
            <p className="mt-2">
              We retain information while your account is active and as needed for billing records,
              dispute resolution, security, and legal compliance. You may request account deletion by
              contacting {supportEmail}. Some data may be retained where required by law or for
              legitimate business purposes (for example, payment records and trial-eligibility flags).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Cookies</h2>
            <p className="mt-2">
              We use only cookies needed for sign-in and security; no advertising or analytics
              cookies. Sign-in uses a session cookie. The app includes a Google Analytics loader
              that runs only when a measurement id is configured. The production
              Content-Security-Policy allows scripts from this site and Stripe only, so
              googletagmanager.com does not load and does not set an analytics cookie.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Your choices and rights</h2>
            <p className="mt-2">
              Depending on your location, you may have rights to access, correct, delete, or export
              personal data, or to object to or restrict certain processing. Contact {legalEmail} to
              exercise these rights. We may verify your identity before responding.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Security</h2>
            <p className="mt-2">
              We use reasonable administrative, technical, and organizational measures to protect
              personal information. No method of transmission or storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Children</h2>
            <p className="mt-2">{LEGAL_DISCLAIMERS.ageRequirement}</p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Changes</h2>
            <p className="mt-2">
              We may update this Privacy Policy. Material changes will be posted here with an updated
              date and, where appropriate, notified by email.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Contact</h2>
            <p className="mt-2">
              Privacy inquiries: {legalEmail} · Account support: {supportEmail} ·{" "}
              <SupportPhoneLink className="font-semibold text-[var(--color-accent)] hover:underline" />
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
