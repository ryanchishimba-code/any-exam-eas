import type { Metadata } from "next";
import Link from "next/link";
import { SupportHoursNote, SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { COMPANY_PUBLIC } from "@/lib/marketing/company";
import { ROUTES } from "@/lib/routes";
import { QUALITY_PAGE_UPDATED } from "@/lib/marketing/quality-facts";

const TITLE = "Contact AnyExamEasy";
const DESCRIPTION = `Email or call AnyExamEasy about billing, a question issue, or privacy. ${COMPANY_PUBLIC.supportPhone.supportLabel}: ${COMPANY_PUBLIC.supportEmail} or ${COMPANY_PUBLIC.supportPhone.display}.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} — Any Exam Easy` },
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.contact },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function ContactPage() {
  const mailto = `mailto:${COMPANY_PUBLIC.supportEmail}`;

  return (
    <article className="bg-[var(--color-bg)] px-6 pb-20 pt-[var(--page-top)]">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Contact
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.25rem)] font-bold tracking-tight text-[var(--color-ink)]">
          Write or call.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
          {COMPANY_PUBLIC.productName} is operated by {COMPANY_PUBLIC.legalName}. For billing, a
          question problem, or a privacy request, email or call the contacts below.
        </p>
        <p className="mt-8 flex flex-col gap-2">
          <a
            href={mailto}
            className="inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-[var(--color-accent)] hover:underline"
          >
            {COMPANY_PUBLIC.supportEmail}
          </a>
          <SupportPhoneLink className="inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-[var(--color-accent)] hover:underline" />
          <SupportHoursNote variant="support" className="text-sm font-semibold text-[var(--color-ink-muted)]" />
        </p>
        <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <li>Billing and cancellation: say so in the subject, or use Cancel or manage billing in Settings.</li>
          <li>A question that looks wrong: use Report an issue on the rationale, and include the question if you email.</li>
          <li>
            Privacy requests: see the{" "}
            <Link href="/legal/privacy" className="font-semibold text-[var(--color-accent)] hover:underline">
              privacy policy
            </Link>
            .
          </li>
        </ul>
        <p className="mt-10 text-xs text-[var(--color-ink-muted)]">Last updated {QUALITY_PAGE_UPDATED}</p>
      </div>
    </article>
  );
}
