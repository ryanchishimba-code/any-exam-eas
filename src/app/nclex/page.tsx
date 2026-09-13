import type { Metadata } from "next";
import Link from "next/link";
import { ExamMarketingLanding } from "@/components/marketing/ExamMarketingLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { formatExactServeReadyCount, getPublishedQuestionStats } from "@/lib/marketing/bank-stats";
import { ROUTES } from "@/lib/routes";
import { buildExamJsonLd, buildExamMetadata } from "@/lib/seo/marketing-metadata";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildExamMetadata("nclex");
}

const PRODUCT_LINKS = [
  {
    href: ROUTES.nclexStudyGuide,
    title: "Free NCLEX study guide",
    body: "Open the book-style reader — NGN chapters you can start without an account.",
    accent: true,
  },
  {
    href: `${ROUTES.questionBank}?field=nursing`,
    title: "NCLEX question bank",
    body: "NGN formats, SATA, and clinical-judgment vignettes with teachable rationales.",
    accent: false,
  },
  {
    href: "/practice/nclex",
    title: "Practice & full exams",
    body: "Timed sets and full-length mocks that follow the NCSBN-style sitting.",
    accent: false,
  },
] as const;

export default async function NclexHubPage() {
  const bankCounts = buildLandingBankCountsDisplay(await getCachedQuestionBankCounts());
  const published = getPublishedQuestionStats();
  const questionCountLabel =
    bankCounts.exams.find((row) => row.slug === "nclex")?.countLabel ??
    formatExactServeReadyCount(published.perBoard.nclex);

  return (
    <>
      <JsonLdScript data={buildExamJsonLd("nclex")} />
      <ExamMarketingLanding
        examKey="nclex"
        questionCountLabel={questionCountLabel}
        extraAfterHero={
          <section className="border-b border-[var(--color-border)]/40 py-14">
            <div className="mx-auto max-w-5xl px-5 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Start here
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-[var(--color-ink)]">
                Study guide, then the Qbank.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
                Read the free NCLEX guide first. When you are ready to practice, start a{" "}
                {formatTrialLabel()} — no card, then {formatMonthlyPrice("pro")}/mo.
              </p>
              <ul className="mt-10 grid gap-4 sm:grid-cols-3" role="list">
                {PRODUCT_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40"
                    >
                      <p
                        className="text-sm font-bold"
                        style={{ color: item.accent ? "var(--color-accent)" : "var(--color-ink)" }}
                      >
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        {item.body}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
                <Link
                  href={landingTrialHrefForExam("nclex")}
                  className="font-semibold text-[var(--color-accent)] hover:underline"
                >
                  Try NCLEX for free →
                </Link>
              </p>
            </div>
          </section>
        }
      />
    </>
  );
}
