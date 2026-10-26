import type { Metadata } from "next";
import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { ClinicalReviewers } from "@/components/marketing/ClinicalReviewers";
import { FounderNote } from "@/components/marketing/elevation/FounderNote";
import { MarketingPhotoHero, MarketingPhotoHeroCopy } from "@/components/marketing/MarketingPhotoHero";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import { ABOUT_HERO_ACCENT, ABOUT_HERO_LEAD } from "@/lib/marketing/about-copy";
import { CLINICAL_REVIEWERS, COMPANY_PUBLIC } from "@/lib/marketing/company";
import { HERO_TRIAL_CTA_LABEL, heroTrialPriceLine } from "@/lib/marketing/home-cta";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { QUALITY_PAGE_UPDATED } from "@/lib/marketing/quality-facts";
import { ROUTES } from "@/lib/routes";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { buildAboutMetadata, buildAboutJsonLd } from "@/lib/seo/marketing-metadata";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";
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

const NOT_AFFILIATED = "We are not affiliated with the boards that write these exams.";

export default async function AboutPage() {
  const { label: totalQuestionsLabel, live } = await publishedOrLiveTotalLabel();
  const [pharmacist, nurse] = CLINICAL_REVIEWERS;

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
                  <p className="mkt-hero-foot__by">{pharmacist?.displayName}</p>
                  <p className="mkt-hero-foot__by">{nurse?.displayName}</p>
                  <p className="mkt-hero-foot__note">{NOT_AFFILIATED}</p>
                </div>
              </div>
            </div>
          }
        >
          <MarketingPhotoHeroCopy
            headingId="about-heading"
            title={
              <>
                <span className="home-hero__line">{ABOUT_HERO_LEAD} </span>
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
                <Link className="bl-button bl-button-secondary" href={ROUTES.howQuestionsAreReviewed}>
                  How questions are reviewed
                </Link>
              </div>
            }
          />
        </MarketingPhotoHero>

        <section className="aee-about-band" aria-labelledby="clinical-reviewers">
          <div className="aee-about-band__inner">
            <ClinicalReviewers />
          </div>
        </section>

        <section className="aee-about-band aee-about-band--mist" aria-labelledby="about-count-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-count-heading">How we count questions</h2>
            {totalQuestionsLabel ? <p className="aee-about-lead">{totalQuestionsLabel}</p> : null}
            <p className="aee-about-copy">
              {live
                ? ACTIVE_QUESTION_DEFINITION
                : "Live bank count is unavailable, so this page does not show a number."}
            </p>
          </div>
        </section>

        <section className="aee-about-band" aria-labelledby="about-terms-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-terms-heading">Trial and pricing</h2>
            <p className="aee-about-offer" data-offer-line>
              {formatPricingCheckoutTrialOffer()}
            </p>
            <PurchaseTrustNotes showTrialOffer={false} />
          </div>
        </section>

        <section className="aee-about-band aee-about-band--mist" aria-labelledby="about-contact-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-contact-heading">Contact</h2>
            <p className="aee-about-contact">
              Operated by {COMPANY_PUBLIC.legalName}.{" "}
              <a href={`mailto:${COMPANY_PUBLIC.supportEmail}`}>{COMPANY_PUBLIC.supportEmail}</a>
              <span aria-hidden> · </span>
              <SupportPhoneLink />
            </p>
          </div>
        </section>

        <section className="aee-about-band" aria-labelledby="about-boards-heading">
          <div className="aee-about-band__inner">
            <h2 id="about-boards-heading">What the product does</h2>
            <ul className="aee-about-exams" role="list">
              {EXAM_HUB_LINKS.map((exam) => (
                <li key={exam.href}>
                  <Link href={exam.href}>
                    {exam.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="aee-about-meta">Last updated {QUALITY_PAGE_UPDATED}</p>
            <div className="aee-about-founder">
              <FounderNote />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
