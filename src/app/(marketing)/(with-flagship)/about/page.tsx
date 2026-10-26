import type { Metadata } from "next";
import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { ClinicalReviewerAvatar } from "@/components/marketing/ClinicalReviewers";
import { MarketingPhotoHero, MarketingPhotoHeroCopy } from "@/components/marketing/MarketingPhotoHero";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import {
  ABOUT_AFFILIATION,
  ABOUT_HERO_ACCENT,
  ABOUT_HERO_LEAD,
  ABOUT_PRODUCT_FEATURES,
  ABOUT_PULL_QUOTE,
  ABOUT_REVIEW_CAVEAT,
  ABOUT_REVIEWERS,
  founderStoryParagraphs,
} from "@/lib/marketing/about-copy";
import { CLINICAL_REVIEWERS, COMPANY_PUBLIC } from "@/lib/marketing/company";
import { HERO_TRIAL_CTA_LABEL, heroTrialPriceLine } from "@/lib/marketing/home-cta";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { QUALITY_PAGE_UPDATED } from "@/lib/marketing/quality-facts";
import { ROUTES } from "@/lib/routes";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { buildAboutMetadata, buildAboutJsonLd } from "@/lib/seo/marketing-metadata";
import { formatMonthlyPrice, formatPricingCheckoutTrialOffer } from "@/lib/site";
import "@/styles/marketing-photo-hero.css";
import "@/styles/about-page.css";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 */
export const revalidate = 300;

export const metadata: Metadata = buildAboutMetadata();

async function publishedOrLiveTotalLabel(): Promise<{ label: string; live: boolean }> {
  const { display } = await loadPublicQuestionCounts({ dynamic: false });
  if (!display.degraded && display.totalServed > 0) {
    return { label: display.sentence || display.totalQuestionsLabel, live: true };
  }
  return { label: "", live: false };
}

const EXAM_HUB_LINKS = [
  { href: examMarketingPath("nclex"), label: "NCLEX" },
  { href: examMarketingPath("usmle"), label: "USMLE" },
  { href: examMarketingPath("naplex"), label: "NAPLEX" },
  { href: examMarketingPath("pance"), label: "PANCE" },
  { href: examMarketingPath("aanp-fnp"), label: "AANP FNP" },
  { href: examMarketingPath("npte-pt"), label: "NPTE-PT" },
] as const;

export default async function AboutPage() {
  const { label: totalQuestionsLabel, live } = await publishedOrLiveTotalLabel();
  const story = founderStoryParagraphs(formatMonthlyPrice("pro"));
  const [opening, priceAndGift, closing] = [story.slice(0, 3), story[3], story[4]];

  return (
    <>
      <JsonLdScript data={buildAboutJsonLd()} />
      <div className="aee-about">
        <MarketingPhotoHero
          heroId="about"
          className="aee-about-hero"
          ariaLabelledBy="about-heading"
          foot={
            <div className="mkt-hero-foot">
              <div className="mkt-hero-foot__slot">
                <div className="mkt-hero-foot__card aee-about-hero__card">
                  {ABOUT_REVIEWERS.map((reviewer) => (
                    <p key={reviewer.id} className="mkt-hero-foot__by">
                      {reviewer.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <MarketingPhotoHeroCopy
            headingId="about-heading"
            title={
              <>
                <span className="home-hero__line">{ABOUT_HERO_LEAD}</span>
                <span className="home-hero__accent">{ABOUT_HERO_ACCENT}</span>
              </>
            }
            subline={`${COMPANY_PUBLIC.productName} is one question bank for six boards.`}
            actions={
              <div className="mkt-photo-hero__actions">
                <div className="bl-actions__primary">
                  <LandingCta
                    href={LANDING_TRIAL_HREF}
                    ctaName="about_hero_trial"
                    location="about_hero"
                  >
                    {HERO_TRIAL_CTA_LABEL}
                  </LandingCta>
                  <p className="bl-hero-price">{heroTrialPriceLine()}</p>
                </div>
              </div>
            }
          />
        </MarketingPhotoHero>

        <section className="aee-about-band aee-about-story" aria-labelledby="about-story-heading">
          <div className="aee-about-band__inner">
            <p className="aee-about-kicker">From the founder</p>
            <h2 id="about-story-heading">Ryan Chishimba, PharmD, RPh</h2>
            {opening.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="aee-about-prose">
                {paragraph}
              </p>
            ))}
            <blockquote className="aee-about-pull">
              <p>{ABOUT_PULL_QUOTE}</p>
            </blockquote>
            {priceAndGift ? <p className="aee-about-prose">{priceAndGift}</p> : null}
            {closing ? <p className="aee-about-prose">{closing}</p> : null}
          </div>
        </section>

        <section className="aee-about-band aee-about-band--mist" aria-labelledby="about-product-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-product-heading">What the product does</h2>
            <ul className="aee-about-features">
              {ABOUT_PRODUCT_FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <ul className="aee-about-exams" aria-label="Boards on this plan">
              {EXAM_HUB_LINKS.map((exam) => (
                <li key={exam.href}>
                  <Link href={exam.href}>
                    {exam.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="aee-about-band" aria-labelledby="about-reviewers-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-reviewers-heading">Who reviews the content</h2>
            <ul className="aee-about-reviewers">
              {ABOUT_REVIEWERS.map((reviewer) => {
                const avatar = CLINICAL_REVIEWERS.find((item) => item.id === reviewer.id);
                return (
                  <li key={reviewer.id}>
                    {avatar ? <ClinicalReviewerAvatar reviewer={avatar} /> : null}
                    <div>
                      <p className="aee-about-reviewer-name">{reviewer.name}</p>
                      <p className="aee-about-prose">{reviewer.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="aee-about-copy">
              {ABOUT_REVIEW_CAVEAT} See our{" "}
              <Link href={ROUTES.howQuestionsAreReviewed}>review standards page</Link> for the full
              methodology.
            </p>
          </div>
        </section>

        <section className="aee-about-band aee-about-band--mist" aria-labelledby="about-basics-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-basics-heading">The basics</h2>
            <dl className="aee-about-facts">
              <div>
                <dt>Company</dt>
                <dd>AnyExamEasy (operated by {COMPANY_PUBLIC.legalName})</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  <a href={`mailto:${COMPANY_PUBLIC.supportEmail}`}>{COMPANY_PUBLIC.supportEmail}</a>
                  <span aria-hidden> · </span>
                  <SupportPhoneLink />
                </dd>
              </div>
            </dl>
            <p className="aee-about-offer" data-offer-line>
              {formatPricingCheckoutTrialOffer()}
            </p>
            <div className="aee-about-trust">
              <PurchaseTrustNotes showTrialOffer={false} />
            </div>
            <p className="aee-about-copy">{ABOUT_AFFILIATION}</p>

            <h3 id="about-count-heading">How we count questions</h3>
            {totalQuestionsLabel ? <p className="aee-about-lead">{totalQuestionsLabel}</p> : null}
            <p className="aee-about-copy">
              {live
                ? ACTIVE_QUESTION_DEFINITION
                : "Live bank count is unavailable, so this page does not show a number."}
            </p>
            <p className="aee-about-meta">Last updated {QUALITY_PAGE_UPDATED}</p>
          </div>
        </section>
      </div>
    </>
  );
}
