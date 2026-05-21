export const metadata = { title: "Privacy Policy — Any Exam Easy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Information we collect</h2>
            <p>
              Account email, name, date of birth (for age verification), study activity,
              generated exams, lesson plans, and payment metadata processed by Stripe.
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">How we use data</h2>
            <p>
              To provide the Service, generate AI content, track progress, process
              subscriptions, and communicate account-related notices.
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Third parties</h2>
            <p>
              We use OpenAI for content generation, Tavily (or similar) for web search,
              Stripe for payments, and hosting providers for infrastructure. Each receives
              only data necessary for their function.
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-[var(--color-ink)]">Retention & rights</h2>
            <p>
              You may request account deletion by contacting support. We retain data as
              needed for legal, billing, and security obligations.
            </p>
          </section>
          <p className="text-xs">
            Template only — consult legal counsel for GDPR, CCPA, FERPA, or HIPAA-adjacent
            obligations if applicable to your users.
          </p>
        </div>
      </article>
    </div>
  );
}
