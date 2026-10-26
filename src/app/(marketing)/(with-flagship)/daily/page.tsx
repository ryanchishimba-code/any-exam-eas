import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DailyInboxCapture } from "@/components/marketing/DailyInboxCapture";
import { DailyQuestionArticle } from "@/components/marketing/DailyQuestionArticle";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
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
  DAILY_HERO_LEAD,
  DAILY_PAGE_DESCRIPTION,
  DAILY_PAGE_TITLE,
} from "@/lib/marketing/daily-copy";
import { HERO_TRIAL_CTA_LABEL, heroTrialPriceLine } from "@/lib/marketing/home-cta";
import { getSiteUrl } from "@/lib/seo";
import { buildDailyHubJsonLd } from "@/lib/seo/daily-jsonld";
import { landingOgImage } from "@/lib/seo/landing-og-image";

/**
 * Today’s six-board set follows the America/Chicago calendar date. A one-minute
 * cache keeps the hub off the dynamic path; it rotates within a minute of
 * midnight Central instead of waiting for the next deploy.
 */
export const revalidate = 60;

const ogImage = landingOgImage("daily");
const dailyCanonical = `${getSiteUrl()}/daily`;

export const metadata: Metadata = {
  title: { absolute: DAILY_PAGE_TITLE },
  description: DAILY_PAGE_DESCRIPTION,
  alternates: { canonical: dailyCanonical },
  openGraph: {
    title: DAILY_PAGE_TITLE,
    description: DAILY_PAGE_DESCRIPTION,
    url: dailyCanonical,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: DAILY_PAGE_TITLE,
    description: DAILY_PAGE_DESCRIPTION,
    images: [ogImage.url],
  },
};

export default function DailyHubPage() {
  const today = todayIsoCentral();
  const featured = getQotdHubFeatured(today);
  const featuredItem = featured ? getQotdForExam(featured, today) : null;
  if (!featured || !featuredItem) notFound();
  const featuredName = EXAM_CATALOG[featured].shortName;
  const answerHref = qotdPath(featured);
  const questions = EXAM_SLUGS.flatMap((slug) => {
    const item = getQotdForExam(slug, today);
    return item ? [item] : [];
  });

  return (
    <div className="aee-daily aee-qotd-hub">
      <JsonLdScript data={buildDailyHubJsonLd(questions, today)} />
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
                <span className="home-hero__line">{DAILY_HERO_LEAD}</span>
                <span className="home-hero__accent">
                  USMLE, FNP, <span className="aee-daily-nowrap">NPTE-PT</span> practice question
                </span>
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

      <section className="aee-daily-band aee-daily-band--cards" aria-labelledby="daily-questions-heading">
        <div className="aee-daily-band__inner">
          <h2 id="daily-questions-heading">Today’s questions and rationales</h2>
          <p className="aee-daily-updated">Updated {formatQotdDisplayDate(today)}.</p>
          {questions.map((item) => (
            <DailyQuestionArticle key={item.examSlug} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
