import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { LEGAL_ENTITY } from "@/lib/legal";
import { SITE_NAME } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: `Contact Us — ${SITE_NAME}` },
  description: `Contact ${SITE_NAME} for billing help, content questions, bug reports, or product feedback. Email ${LEGAL_ENTITY.supportEmail} or send a message — we read every submission.`,
  keywords: [
    "contact AnyExamEasy",
    "Any Exam Easy support",
    "board exam prep help",
    "AnyExamEasy feedback",
  ],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <section className="relative overflow-hidden px-6 pt-[var(--page-top)]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-xl pb-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 text-balance text-[clamp(2rem,5vw,2.75rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
            Contact Us
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Billing questions, content issues, bug reports, or study feedback — send a message and
            we&apos;ll get back to you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${LEGAL_ENTITY.supportEmail}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/40"
            >
              <Mail className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              {LEGAL_ENTITY.supportEmail}
            </a>
            <p className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <MessageSquare className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              Or use the form below
            </p>
          </div>

          <div className="mt-10">
            <FeedbackForm />
          </div>

          <p className="mt-8 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Looking for prep strategy first? Browse the{" "}
            <Link href={ROUTES.toolkit} className="font-semibold text-[var(--color-accent)] hover:underline">
              Toolkit
            </Link>{" "}
            or read{" "}
            <Link href={ROUTES.about} className="font-semibold text-[var(--color-accent)] hover:underline">
              why we built {SITE_NAME}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
