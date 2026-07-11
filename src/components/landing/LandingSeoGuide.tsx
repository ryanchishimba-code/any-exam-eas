import Link from "next/link";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, SITE_NAME } from "@/lib/site";

const EXAM_LINKS = [
  {
    href: examMarketingPath("nclex"),
    name: "NCLEX-RN",
    blurb: "NGN-ready NCLEX practice questions, clinical judgment, and prioritization drills.",
  },
  {
    href: examMarketingPath("usmle"),
    name: "USMLE",
    blurb: "Step 1, Step 2 CK, and Step 3 question bank coverage on one USMLE track.",
  },
  {
    href: examMarketingPath("naplex"),
    name: "NAPLEX",
    blurb: "Calculations, therapeutics, and patient cases for pharmacy boards.",
  },
  {
    href: examMarketingPath("pance"),
    name: "PANCE",
    blurb: "Organ-system vignettes and task-area practice for PA certification.",
  },
  {
    href: examMarketingPath("aanp-fnp"),
    name: "AANP FNP",
    blurb: "Primary-care decision making for family nurse practitioner boards.",
  },
  {
    href: examMarketingPath("npte-pt"),
    name: "NPTE-PT",
    blurb: "Systems, modalities, and clinical application for physical therapy licensure.",
  },
] as const;

/**
 * Long-form SEO guide for the homepage — server-rendered for crawlers,
 * placed below the conversion funnel so the hero stays clean.
 */
export function LandingSeoGuide({ questionCountLabel }: { questionCountLabel?: string }) {
  const count = questionCountLabel?.trim() || SEO_LIVE_STATS.questionCount;

  return (
    <section
      className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-6 sm:py-24"
      aria-labelledby="seo-guide-heading"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Board exam question banks
        </p>
        <h2
          id="seo-guide-heading"
          className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]"
        >
          One affordable subscription. Six exam question banks.
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
          <p>
            {SITE_NAME} is built for students who need a serious{" "}
            <strong className="font-semibold text-[var(--color-ink)]">NCLEX question bank</strong>,
            high-yield{" "}
            <strong className="font-semibold text-[var(--color-ink)]">NCLEX practice questions</strong>,
            and a full{" "}
            <strong className="font-semibold text-[var(--color-ink)]">USMLE question bank</strong> —
            without buying a separate subscription for every licensing exam.
          </p>
          <p>
            One Pro plan unlocks {PLATFORM_EXAM_LIST}: {count} QA-gated items, AI Tutor coaching on
            misses, adaptive Blueprint Roadmaps, Spaced Repetition, and full-length mocks — starting
            at {formatMonthlyPrice("pro")}/mo after a free trial. That is the unique selling point:
            premium multi-exam prep at a student-friendly price.
          </p>
        </div>

        <h3 className="mt-12 text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl">
          Why students choose a multi-exam NCLEX &amp; USMLE question bank
        </h3>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
          <p>
            Most big-name banks charge per exam. If you are preparing for NCLEX-RN now and may face
            USMLE, NAPLEX, PANCE, AANP FNP, or NPTE-PT later — or you are supporting classmates across
            programs — stacking per-exam subscriptions adds up fast. {SITE_NAME} keeps every board
            under one login so your study system stays consistent.
          </p>
          <p>
            Our NCLEX practice questions emphasize Next Gen clinical judgment formats. The USMLE
            question bank spans Step 1 basic sciences through Step 2 CK and Step 3 style cases.
            NAPLEX, PANCE, FNP, and NPTE-PT banks follow the same QA-gated standard so quality does
            not drop when you switch exams.
          </p>
        </div>

        <h3 className="mt-12 text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl">
          Explore each exam question bank
        </h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {EXAM_LINKS.map((exam) => (
            <li key={exam.href}>
              <Link
                href={exam.href}
                className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40 hover:shadow-[var(--shadow-apple-sm)]"
              >
                <span className="text-base font-bold text-[var(--color-ink)]">{exam.name}</span>
                <span className="mt-2 block text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {exam.blurb}
                </span>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--color-accent)]">
                  Open {exam.name} prep →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl">
          Study smarter with Toolkit guides and the blog
        </h3>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
          <p>
            Pair timed practice with strategy. The{" "}
            <Link href={ROUTES.toolkit} className="font-semibold text-[var(--color-accent)] hover:underline">
              Toolkit
            </Link>{" "}
            organizes exam breakdowns, comparison guides, and readiness tips. The{" "}
            <Link href={ROUTES.blog} className="font-semibold text-[var(--color-accent)] hover:underline">
              blog
            </Link>{" "}
            publishes high-yield study systems for NCLEX, USMLE, NAPLEX, and multi-exam prep — so you
            are not guessing what to do next.
          </p>
          <p>
            Ready to try the banks yourself? Start a free trial, run a short NCLEX or USMLE set, and
            see how Blueprint Roadmaps + AI Tutor change the way you review misses. When you are
            ready for unlimited access across all six exams, upgrade once — not six times.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href={ROUTES.pricing} className="text-[var(--color-accent)] hover:underline">
            See pricing →
          </Link>
          <Link href={ROUTES.about} className="text-[var(--color-accent)] hover:underline">
            About our clinician-built approach →
          </Link>
          <Link href={ROUTES.compare} className="text-[var(--color-accent)] hover:underline">
            Compare vs UWorld &amp; others →
          </Link>
        </div>
      </div>
    </section>
  );
}
