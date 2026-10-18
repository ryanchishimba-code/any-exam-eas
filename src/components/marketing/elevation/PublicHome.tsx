import Link from "next/link";
import type { ReactNode } from "react";
import { LandingCta } from "@/components/landing/LandingCta";
import { ClinicalReviewerAvatar } from "@/components/marketing/ClinicalReviewers";
import { HomeCompare } from "@/components/marketing/elevation/HomeCompare";
import { HomePassVideo } from "@/components/marketing/elevation/HomePassVideo";
import { HomeQuickBites } from "@/components/marketing/elevation/HomeQuickBites";
import { HomeStickyCta } from "@/components/marketing/elevation/HomeStickyCta";
import { IconCases, IconCheck, IconReviewers } from "@/components/marketing/elevation/home-icons";
import "@/styles/home-visual.css";
import { LANDING_HERO_EXAMS, LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { HOME_EXPLAINED_SAMPLE } from "@/lib/marketing/home-explained";
import { HOME_FAQ } from "@/lib/marketing/home-faq";
import {
  HOME_NO_PAYMENT_LINE,
  homeTrialCloseHeading,
  homeTrialCtaLabel,
} from "@/lib/marketing/home-cta";
import { howToPassSharePath } from "@/lib/marketing/home-video";
import { boardReviewBadge, HOME_PRACTICE_HEADLINE, RATIONALE_STUDY_NOTE } from "@/lib/marketing/legal-copy";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { absoluteUrl } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice } from "@/lib/site";

const TRUST = [
  { icon: IconCheck, label: "Rationale for every option" },
  { icon: IconReviewers, label: "Named clinical reviewers" },
  { icon: IconCases, label: "NGN and case questions" },
] as const;

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

/** First-screen board tiles. Labels match the hero; hrefs are the public board pages. */
const HERO_BOARD_TILES: { slug: ExamSeoKey; label: string }[] = [
  { slug: "nclex", label: "NCLEX" },
  { slug: "naplex", label: "NAPLEX" },
  { slug: "usmle", label: "USMLE" },
  { slug: "aanp-fnp", label: "FNP" },
  { slug: "pance", label: "PANCE" },
  { slug: "npte-pt", label: "NPTE-PT" },
];

export function PublicHome({
  proof,
  quote,
  ngnCaseStudies = false,
}: {
  proof?: ReactNode;
  quote?: ReactNode;
  /** Set when the same snapshot has published NCLEX case studies. */
  ngnCaseStudies?: boolean;
}) {
  const cta = homeTrialCtaLabel();
  const headlineBreak = HOME_PRACTICE_HEADLINE.lastIndexOf(". ");
  const headlineLead =
    headlineBreak === -1 ? HOME_PRACTICE_HEADLINE : HOME_PRACTICE_HEADLINE.slice(0, headlineBreak + 1);
  const headlineAccent =
    headlineBreak === -1 ? "" : HOME_PRACTICE_HEADLINE.slice(headlineBreak + 2);

  return (
    <div className="home-visual home-has-sticky">
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero__panel">
          <h1 id="hero-heading">
            <span className="home-hero__line">{headlineLead}</span>{" "}
            <span className="home-hero__accent">{headlineAccent}</span>
          </h1>
          <nav className="home-hero__boards" aria-label="Board exams">
            <ul>
              {HERO_BOARD_TILES.map((board) => (
                <li key={board.slug}>
                  <Link href={examMarketingPath(board.slug)}>{board.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="home-hero__sub">Every exam, every rationale, one plan.</p>
          <div className="home-hero__actions">
            <LandingCta href={LANDING_TRIAL_HREF} ctaName="hero_trial" location="hero">
              {cta}
            </LandingCta>
          </div>
          <p className="home-hero__note">{HOME_NO_PAYMENT_LINE}</p>
          <ul className="home-trust" aria-label="What is included">
            {TRUST.map((item) => (
              <li key={item.label}>
                <item.icon />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {proof}

      <section className="home-section home-rise" aria-labelledby="explained-heading">
        <h2 id="explained-heading">Every question explained.</h2>
        <p className="home-lead">The right choice and each wrong one, in plain language.</p>
        <div className="home-device">
          <div className="home-device__back" aria-hidden />
          <article className="home-device__screen">
            <header className="home-device__chrome">
              <span className="home-device__dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <p>{HOME_EXPLAINED_SAMPLE.exam} sample</p>
            </header>
            <div className="home-q">
              <p className="home-q__stem">{HOME_EXPLAINED_SAMPLE.stem}</p>
              <ol className="home-q__options">
                {HOME_EXPLAINED_SAMPLE.options.map((option, index) => (
                  <li
                    key={option.text}
                    className={option.correct ? "home-q__option is-correct" : "home-q__option"}
                  >
                    <p className="home-q__choice">
                      <span className="home-q__letter">{LETTERS[index] ?? index + 1}</span>
                      <span>
                        {option.correct ? <span className="sr-only">Correct answer. </span> : null}
                        {option.text}
                      </span>
                    </p>
                    <p className="home-q__why">{option.rationale}</p>
                  </li>
                ))}
              </ol>
              <p className="home-q__note">{RATIONALE_STUDY_NOTE}</p>
            </div>
          </article>
        </div>
      </section>

      <HomePassVideo
        shareUrl={absoluteUrl(howToPassSharePath())}
        heading="h2"
      />

      <section className="home-section home-rise" aria-labelledby="ngn-heading">
        <div className="home-strip">
          <span className="home-strip__icon" aria-hidden>
            <IconCases />
          </span>
          <div>
            <h2 id="ngn-heading">Practice the new format.</h2>
            <p>NGN and case questions, including bow-tie items.</p>
          </div>
        </div>
      </section>

      <HomeQuickBites />
      <HomeCompare ngnCaseStudies={ngnCaseStudies} />

      <section className="home-section home-section--mist home-rise" aria-labelledby="price-heading">
        <h2 id="price-heading">Six boards. One price.</h2>
        <article className="home-price">
          <p className="home-price__plan">Pro</p>
          <p className="home-price__amount">{formatMonthlyPrice("pro")}</p>
          <p className="home-price__period">a month</p>
          <p className="home-price__trial">{HOME_NO_PAYMENT_LINE}</p>
          <ul className="home-boards">
            {LANDING_HERO_EXAMS.map((exam) => (
              <li key={exam.slug}>
                <Link href={examMarketingPath(exam.slug)}>{exam.label}</Link>
              </li>
            ))}
          </ul>
          <LandingCta href={LANDING_TRIAL_HREF} ctaName="home_price_trial" location="home_price">
            {cta}
          </LandingCta>
        </article>
      </section>

      <section className="home-section home-review home-rise" aria-labelledby="reviewers-heading">
        <h2 id="reviewers-heading">Content review.</h2>
        <ul className="home-reviewers">
          {CLINICAL_REVIEWERS.map((reviewer) => (
            <li key={reviewer.id} className="home-reviewer">
              <ClinicalReviewerAvatar reviewer={reviewer} size="sm" />
              <div>
                <h3>{reviewer.displayName}</h3>
                <p>{boardReviewBadge(reviewer.examKeys[0] ?? "", reviewer.displayName)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {quote}

      <section className="home-section home-section--mist home-faq home-rise" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Questions.</h2>
        <div className="home-faq__list">
          {HOME_FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <p className="home-faq__more-wrap">
          <Link className="home-faq__more" href={ROUTES.faq}>
            All questions
          </Link>
        </p>
      </section>

      <section className="home-close" aria-labelledby="close-heading">
        <h2 id="close-heading">{homeTrialCloseHeading()}</h2>
        <p>{HOME_NO_PAYMENT_LINE}</p>
        <LandingCta href={LANDING_TRIAL_HREF} ctaName="home_close_trial" location="home_close">
          {cta}
        </LandingCta>
      </section>

      <HomeStickyCta label={cta} />
    </div>
  );
}
