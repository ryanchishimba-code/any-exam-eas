import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  formatQotdDisplayDate,
  getQotdForExam,
  getQotdHubFeatured,
  qotdPath,
  todayIsoUtc,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import { getSiteUrl } from "@/lib/seo";
import { LandingCta } from "@/components/landing/LandingCta";
import type { ExamSlug } from "@/types/edtech";

/** “Today” must resolve at request time — never freeze the hub at build/deploy. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Question of the Day — Free Board Exam Practice",
  description:
    "A free daily practice question for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT. Answer without signup, then start a free trial for your exam.",
  alternates: { canonical: `${getSiteUrl()}/daily` },
  openGraph: {
    title: "Question of the Day | AnyExamEasy",
    description:
      "Free daily board-style practice across six exams. Pick your board and try today’s item.",
    url: `${getSiteUrl()}/daily`,
    type: "website",
  },
};

export default function DailyHubPage() {
  const today = todayIsoUtc();
  const featured = getQotdHubFeatured(today);
  const featuredItem = getQotdForExam(featured, today);
  const featuredName = EXAM_CATALOG[featured].shortName;

  return (
    <div className="aee-qotd-hub">
      <div className="aee-qotd-hub__inner">
        <p className="aee-qotd-hub__eyebrow">AnyExamEasy</p>
        <h1 className="aee-qotd-hub__title">Question of the Day</h1>
        <p className="aee-qotd-hub__lede">
          One free board-style item per exam, every day. No account required to try — share
          with classmates and start a free trial when you&apos;re ready.
        </p>
        <p className="aee-qotd-hub__date">{formatQotdDisplayDate(today)}</p>

        <section className="aee-qotd-hub__featured" aria-labelledby="featured-qotd">
          <p className="aee-qotd-hub__featured-label">Today&apos;s featured board</p>
          <h2 id="featured-qotd" className="aee-qotd-hub__featured-title">
            {featuredName}
          </h2>
          <p className="aee-qotd-hub__featured-stem">{featuredItem.stem}</p>
          <div className="aee-qotd-hub__featured-actions">
            <Link
              href={qotdPath(featured, today)}
              prefetch={false}
              className="aee-flagship-cta aee-flagship-cta--hero group inline-flex items-center gap-2"
            >
              Answer today&apos;s {featuredName} question
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <LandingCta
              href={landingTrialHrefForExam(featured)}
              ctaName={`qotd_hub_trial_${featured}`}
              location="qotd_hub"
              variant="secondary"
            >
              Try {featuredName} free
            </LandingCta>
          </div>
        </section>

        <section aria-labelledby="all-boards-qotd">
          <h2 id="all-boards-qotd" className="aee-qotd-hub__grid-title">
            All boards today
          </h2>
          <ul className="aee-qotd-hub__grid">
            {EXAM_SLUGS.map((slug: ExamSlug) => {
              const item = getQotdForExam(slug, today);
              return (
                <li key={slug}>
                  <Link
                    href={qotdPath(slug, today)}
                    prefetch={false}
                    className="aee-qotd-hub__card"
                  >
                    <span
                      className="aee-qotd-hub__card-exam"
                      style={{ color: item.examColor }}
                    >
                      {EXAM_CATALOG[slug].shortName}
                    </span>
                    <span className="aee-qotd-hub__card-stem">{item.stem}</span>
                    <span className="aee-qotd-hub__card-cta">Answer →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
