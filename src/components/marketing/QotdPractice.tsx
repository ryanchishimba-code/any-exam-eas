"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { SocialShareBar } from "@/components/social/SocialShareBar";
import type { QotdItem } from "@/lib/demo/qotd";
import {
  examMarketingHref,
  formatQotdDisplayDate,
  qotdEntityId,
  qotdPath,
  qotdShareCaption,
} from "@/lib/demo/qotd";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { formatTrialCtaLabel } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ExamSlug } from "@/types/edtech";

const LABELS = ["A", "B", "C", "D"] as const;

export function QotdPractice({
  item,
  dateIso,
  absoluteShareUrl,
}: {
  item: QotdItem;
  dateIso: string;
  absoluteShareUrl: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = revealed && selected === item.correct;
  const examName = EXAM_CATALOG[item.examSlug]?.shortName ?? item.examLabel;

  return (
    <div className="aee-qotd">
      <header className="aee-qotd__hero">
        <p className="aee-qotd__eyebrow">AnyExamEasy · Question of the Day</p>
        <h1 className="aee-qotd__title">
          <span
            className="aee-qotd__exam-chip"
            style={{
              color: item.examColor,
              borderColor: `${item.examColor}55`,
              backgroundColor: `${item.examColor}14`,
            }}
          >
            {item.examLabel}
          </span>{" "}
          practice question
        </h1>
        <p className="aee-qotd__date">{formatQotdDisplayDate(dateIso)}</p>
        <p className="aee-qotd__lede">
          Answer free — no account needed. Then try the full {examName} bank.
        </p>
      </header>

      <article className="aee-landing-sample__card aee-qotd__card">
        <header className="aee-landing-sample__card-head">
          <span
            className="aee-landing-sample__badge"
            style={{
              color: item.examColor,
              borderColor: `${item.examColor}40`,
              backgroundColor: `${item.examColor}12`,
            }}
          >
            {item.examLabel}
          </span>
          <span className="aee-landing-sample__hint">QOTD · no signup</span>
        </header>

        <p className="aee-landing-sample__stem">{item.stem}</p>

        <ul className="aee-landing-sample__options" role="listbox" aria-label="Answer choices">
          {item.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrectOpt = revealed && opt === item.correct;
            const isWrong = revealed && isSelected && opt !== item.correct;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={revealed}
                  onClick={() => setSelected(opt)}
                  className={cn(
                    "aee-landing-sample__option",
                    isSelected && !revealed && "aee-landing-sample__option--selected",
                    isCorrectOpt && "aee-landing-sample__option--correct",
                    isWrong && "aee-landing-sample__option--wrong"
                  )}
                >
                  <span className="aee-landing-sample__letter" aria-hidden>
                    {LABELS[i] ?? "?"}
                  </span>
                  <span className="flex-1 text-left">{opt}</span>
                  {isCorrectOpt ? (
                    <Check className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {!revealed ? (
          <button
            type="button"
            disabled={!selected}
            onClick={() => setRevealed(true)}
            className="aee-landing-sample__check"
          >
            Check answer
          </button>
        ) : (
          <div className="aee-landing-sample__result">
            <p
              className={cn(
                "aee-landing-sample__verdict",
                correct ? "aee-landing-sample__verdict--ok" : "aee-landing-sample__verdict--miss"
              )}
            >
              {correct ? "Correct" : "Not quite — review the rationale"}
            </p>
            <p className="aee-landing-sample__rationale">
              <strong>Rationale:</strong> {item.rationale}
            </p>
            <button
              type="button"
              className="aee-landing-sample__retry"
              onClick={() => {
                setSelected(null);
                setRevealed(false);
              }}
            >
              Try again
            </button>
          </div>
        )}
      </article>

      <div className="aee-qotd__cta">
        <LandingCta
          href={landingTrialHrefForExam(item.examSlug)}
          ctaName={`qotd_trial_${item.examSlug}`}
          location="qotd"
          className="aee-flagship-cta--hero group"
          icon={
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          }
        >
          Try {examName} free
        </LandingCta>
        <Link
          href={examMarketingHref(item.examSlug)}
          prefetch={false}
          className="aee-qotd__secondary"
        >
          Explore {examName} prep →
        </Link>
        <p className="aee-qotd__cta-meta">{formatTrialCtaLabel()} · no card required</p>
      </div>

      <div className="aee-qotd__share">
        <p className="aee-qotd__share-label">Share today’s question</p>
        <SocialShareBar
          entityType="question"
          entityId={qotdEntityId(item.examSlug, dateIso)}
          url={absoluteShareUrl}
          text={qotdShareCaption(item, dateIso)}
        />
      </div>

      <nav className="aee-qotd__more" aria-label="More board Question of the Day pages">
        <p className="aee-qotd__more-label">More boards</p>
        <ul className="aee-qotd__more-list">
          {EXAM_SLUGS.filter((s) => s !== item.examSlug).map((slug: ExamSlug) => (
            <li key={slug}>
              <Link href={qotdPath(slug)} prefetch={false} className="aee-qotd__more-link">
                {EXAM_CATALOG[slug].shortName}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/daily" prefetch={false} className="aee-qotd__more-link">
              All daily questions
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
