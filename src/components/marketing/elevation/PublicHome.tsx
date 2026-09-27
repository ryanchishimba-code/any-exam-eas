import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LandingCta } from "@/components/landing/LandingCta";
import { ClinicalReviewerAvatar } from "@/components/marketing/ClinicalReviewers";
import "@/styles/home-visual.css";
import {
  HOME_HERO_SHORT_SUBLINE,
  LANDING_HERO_EXAMS,
  LANDING_TRIAL_HREF,
} from "@/lib/landing/content";
import {
  HOME_PRACTICE_HEADLINE,
  HOME_READINESS_HEADING,
  HOME_READINESS_LINE,
} from "@/lib/marketing/legal-copy";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import { formatNclexPrepPriceComparison } from "@/lib/marketing/price-comparison";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, formatPricingCheckoutTrialOffer } from "@/lib/site";
import { FOUNDER_NOTE } from "@/lib/testimonials/consented-seed";

const QUESTION_DESKTOP = {
  src: "/marketing/home/question-desktop.webp",
  width: 1920,
  height: 1240,
} as const;

const QUESTION_PHONE = {
  src: "/marketing/home/question-phone.webp",
  width: 780,
  height: 1520,
} as const;

const BOWTIE = {
  src: "/marketing/home/bowtie.webp",
  width: 2240,
  height: 1012,
} as const;

const READINESS = {
  src: "/marketing/home/readiness.webp",
  width: 2240,
  height: 1522,
} as const;

function LaptopFrame({
  src,
  width,
  height,
  alt,
  priority = false,
  sizes,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure className="home-laptop">
      <div className="home-laptop__screen">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          quality={82}
        />
      </div>
      <div className="home-laptop__base" aria-hidden />
    </figure>
  );
}

function PhoneFrame({
  src,
  width,
  height,
  alt,
  priority = false,
  sizes,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure className="home-phone">
      <div className="home-phone__screen">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          quality={82}
        />
      </div>
    </figure>
  );
}

export function PublicHome({
  proof,
  quote,
}: {
  proof?: ReactNode;
  quote?: ReactNode;
}) {
  return (
    <div className="home-visual">
      <section className="home-hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading">{HOME_PRACTICE_HEADLINE}</h1>
        <p className="home-hero__sub">{HOME_HERO_SHORT_SUBLINE}</p>
        <div className="home-hero__actions">
          <LandingCta href={LANDING_TRIAL_HREF} ctaName="hero_trial" location="hero">
            Start free trial
          </LandingCta>
          <Link href={`${examMarketingPath("nclex")}#try-questions`} className="home-hero__secondary">
            Try a free question
          </Link>
        </div>
        <p className="home-hero__offer" data-offer-line>
          {formatPricingCheckoutTrialOffer()}
        </p>
        <div className="home-hero__visual">
          <div className="home-hero__stage">
            <div className="home-hero__laptop">
              <LaptopFrame
                {...QUESTION_DESKTOP}
                alt="Laptop showing a practice question with its rationale open"
                priority
                sizes="(min-width: 768px) 820px, 100vw"
              />
            </div>
            <div className="home-hero__phone">
              <PhoneFrame
                {...QUESTION_PHONE}
                alt="Phone showing a practice question with its rationale open"
                priority
                sizes="(min-width: 768px) 220px, 74vw"
              />
            </div>
          </div>
        </div>
      </section>

      {proof}

      <section className="home-panel home-rise" aria-labelledby="explained-heading">
        <h2 id="explained-heading">Every question explained.</h2>
        <p className="home-panel__line">The rationale stays on the item.</p>
        <div className="home-panel__visual">
          <PhoneFrame
            {...QUESTION_PHONE}
            alt="Rationale open under a practice question"
            sizes="280px"
          />
        </div>
      </section>

      <section className="home-panel home-panel--navy home-rise" aria-labelledby="ngn-heading">
        <h2 id="ngn-heading">Practice the new format.</h2>
        <p className="home-panel__line">Next Generation case studies.</p>
        <div className="home-panel__visual">
          <LaptopFrame
            {...BOWTIE}
            alt="NGN bow-tie with actions, a condition, and parameters to monitor"
            sizes="(min-width: 768px) 920px, 100vw"
          />
        </div>
      </section>

      <section className="home-panel home-panel--mist home-rise" aria-labelledby="ready-heading">
        <h2 id="ready-heading">{HOME_READINESS_HEADING}</h2>
        <p className="home-panel__line">{HOME_READINESS_LINE}</p>
        <div className="home-panel__visual">
          <LaptopFrame
            {...READINESS}
            alt="Practice estimate from questions answered in the app. Not a prediction of an exam result."
            sizes="(min-width: 768px) 920px, 100vw"
          />
        </div>
      </section>

      <section className="home-panel home-rise" aria-labelledby="price-heading">
        <h2 id="price-heading">Six boards. One price.</h2>
        <p className="home-panel__line">{formatMonthlyPrice("pro")} a month.</p>
        <ul className="home-boards">
          {LANDING_HERO_EXAMS.map((exam) => (
            <li key={exam.slug}>
              <Link href={examMarketingPath(exam.slug)}>{exam.label}</Link>
            </li>
          ))}
        </ul>
        <p className="home-panel__note" data-price-comparison>
          {formatNclexPrepPriceComparison()}
        </p>
      </section>

      <section className="home-panel home-panel--mist home-rise" aria-labelledby="reviewers-heading">
        <h2 id="reviewers-heading">Reviewed by clinicians.</h2>
        <ul className="home-reviewers">
          {CLINICAL_REVIEWERS.map((reviewer) => (
            <li key={reviewer.id} className="home-reviewer">
              <ClinicalReviewerAvatar reviewer={reviewer} size="sm" />
              <p>{reviewer.displayName}</p>
            </li>
          ))}
        </ul>
      </section>

      {quote}

      <section className="home-close" aria-label="More">
        <p>
          <Link href={ROUTES.faq}>Questions?</Link>
        </p>
        <p className="home-close__founder">
          “{FOUNDER_NOTE.quote}” {FOUNDER_NOTE.attribution}
        </p>
      </section>
    </div>
  );
}
