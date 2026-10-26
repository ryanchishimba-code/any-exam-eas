import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DailyInboxCapture } from "@/components/marketing/DailyInboxCapture";
import { MarketingPhotoHero, MarketingPhotoHeroCopy } from "@/components/marketing/MarketingPhotoHero";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  formatQotdDisplayDate,
  getQotdForExam,
  getQotdHubFeatured,
  qotdPath,
  todayIsoCentral,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import {
  DAILY_HERO_HEADLINE,
  DAILY_OG_DESCRIPTION,
  DAILY_PAGE_DESCRIPTION,
  DAILY_PAGE_TITLE,
} from "@/lib/marketing/daily-copy";
import { HERO_TRIAL_CTA_LABEL, heroTrialPriceLine } from "@/lib/marketing/home-cta";
import { getSiteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { landingOgImage } from "@/lib/seo/landing-og-image";
import type { ExamSlug } from "@/types/edtech";

/**
 * Today’s six-board set follows the America/Chicago calendar date. A one-minute
 * cache keeps the hub off the dynamic path; it rotates within a minute of
 * midnight Central instead of waiting for the next deploy.
 * Question rich-result markup is omitted: it requires the accepted answer,
 * which would publish the key in the HTML.
 */
export const revalidate = 60;

const ogImage = landingOgImage("daily");

export const metadata: Metadata = {
  title: DAILY_PAGE_TITLE,
  description: DAILY_PAGE_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/daily` },
  openGraph: {
    title: `${DAILY_PAGE_TITLE} | ${SITE_NAME}`,
    description: DAILY_OG_DESCRIPTION,
    url: `${getSiteUrl()}/daily`,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${DAILY_PAGE_TITLE} | ${SITE_NAME}`,
    description: DAILY_OG_DESCRIPTION,
    images: [ogImage.url],
  },
};

export default function DailyHubPage() {
  const today = todayIsoCentral();
  const featured = getQotdHubFeatured(today);
  const featuredItem = featured ? getQotdForExam(featured, today) : null;
  if (!featured || !featuredItem) notFound();
  const featuredName = EXAM_CATALOG[featured].shortName;
  const answerHref = qotdPath(featured, today);
  const headlineBreak = DAILY_HERO_HEADLINE.lastIndexOf(", ");
  const headlineLead =
    headlineBreak === -1 ? DAILY_HERO_HEADLINE : DAILY_HERO_HEADLINE.slice(0, headlineBreak + 1);
  const headlineAccent =
    headlineBreak === -1 ? "" : DAILY_HERO_HEADLINE.slice(headlineBreak + 2);

  return (
    <div className="aee-daily aee-qotd-hub">
      <MarketingPhotoHero
        heroId="daily"
        className="aee-daily-hero"
        ariaLabelledBy="daily-hero-heading"
        foot={
          <div className="mkt-hero-foot">
            <div className="mkt-hero-foot__slot">
              <Link
                href={answerHref}
                prefetch={false}
                className="mkt-hero-foot__card aee-daily-hero__card"
              >
                <p className="mkt-hero-foot__by">Today&apos;s {featuredName} question</p>
                <p className="aee-daily-hero__stem">{featuredItem.stem}</p>
                <p className="aee-daily-hero__answer">Answer today&apos;s question</p>
              </Link>
            </div>
          </div>
        }
      >
        <MarketingPhotoHeroCopy
          headingId="daily-hero-heading"
          title={
            <>
              <span className="home-hero__line">{headlineLead} </span>
              <span className="home-hero__accent">{headlineAccent}</span>
            </>
          }
          subline={`${formatQotdDisplayDate(today)} · Six boards, no account to answer.`}
          actions={
            <div className="mkt-photo-hero__actions">
              <div className="bl-actions__primary">
                <LandingCta
                  href={landingTrialHrefForExam(featured)}
                  ctaName={`qotd_hub_trial_${featured}`}
                  location="qotd_hub"
                >
                  {HERO_TRIAL_CTA_LABEL}
                </LandingCta>
                <p className="bl-hero-price">{heroTrialPriceLine()}</p>
              </div>
              <Link
                href={answerHref}
                prefetch={false}
                className="bl-button bl-button-secondary"
              >
                Answer today&apos;s question
              </Link>
            </div>
          }
        />
      </MarketingPhotoHero>

      <section className="aee-daily-band" aria-labelledby="daily-inbox-heading">
        <div className="aee-daily-band__inner">
          <h2 id="daily-inbox-heading">Get the next question by email</h2>
          <DailyInboxCapture />
        </div>
      </section>

      <section className="aee-daily-band aee-daily-band--cards" aria-labelledby="all-boards-qotd">
        <div className="aee-daily-band__inner">
          <h2 id="all-boards-qotd">All six boards today</h2>
          <ul className="aee-daily-grid">
            {EXAM_SLUGS.map((slug: ExamSlug) => {
              const item = getQotdForExam(slug, today);
              if (!item) return null;
              return (
                <li key={slug}>
                  <Link
                    href={qotdPath(slug, today)}
                    prefetch={false}
                    className="aee-daily-card"
                  >
                    <span className="aee-daily-card__exam">{EXAM_CATALOG[slug].shortName}</span>
                    <span className="aee-daily-card__stem">{item.stem}</span>
                    <span className="aee-daily-card__cta">Answer →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
