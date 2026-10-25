import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildFinishLineTermsHtml } from "@/lib/marketing/finish-line-terms";
import { isFinishLineOfferEnabled } from "@/lib/marketing/finish-line-offer";
import { LEGAL_ENTITY } from "@/lib/legal";

export const metadata: Metadata = {
  title: { absolute: "Finish Line Refund terms — Any Exam Easy" },
  description:
    "Conditional refund terms for eligible Any Exam Easy plans. Educational prep only — not a promise of exam results.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/finish-line-refund-terms" },
};

export default function FinishLineRefundTermsPage() {
  if (!isFinishLineOfferEnabled()) notFound();

  const html = buildFinishLineTermsHtml();

  return (
    <div className="min-h-screen px-6 pb-20 pt-24">
      <article className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Finish Line Refund
        </p>
        <div
          className="finish-line-terms-prose mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-ink-muted)] [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[var(--color-ink)] [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[var(--color-ink)] [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[var(--color-ink)] [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-[var(--color-ink)] [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <p className="mt-10 text-xs text-[var(--color-ink-muted)]">
          {LEGAL_ENTITY.productName} is a product of {LEGAL_ENTITY.companyName}. Questions?{" "}
          <a
            href={`mailto:${LEGAL_ENTITY.supportEmail}`}
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            {LEGAL_ENTITY.supportEmail}
          </a>
        </p>
        <p className="mt-4 text-sm">
          <Link href="/legal/terms" className="font-semibold text-[var(--color-accent)] hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/legal/refunds" className="font-semibold text-[var(--color-accent)] hover:underline">
            Refunds and cancellation
          </Link>
        </p>
      </article>
    </div>
  );
}
