"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { StudyUseNote } from "@/components/legal/StudyUseNote";
import {
  DailyTrialLink,
  DailyTrialPitch,
  trackDailyAnswer,
} from "@/components/marketing/DailyTrialCta";
import { SocialShareBar } from "@/components/social/SocialShareBar";
import type { QotdPublicItem } from "@/lib/demo/qotd-public";
import {
  examMarketingHref,
  formatQotdDisplayDate,
  qotdEntityId,
  qotdPath,
  qotdShareCaption,
} from "@/lib/demo/qotd-public";
import { revealQotdAnswer } from "@/lib/demo/qotd-reveal";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ExamSlug } from "@/types/edtech";

const LABELS = ["A", "B", "C", "D"] as const;

export function QotdPractice({
  item,
  dateIso,
  absoluteShareUrl,
}: {
  item: QotdPublicItem;
  dateIso: string;
  absoluteShareUrl: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{
    correctOption: string;
    rationale: string;
    isCorrect: boolean;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const revealed = reveal !== null;
  const correct = reveal?.isCorrect ?? false;

  async function onCheck() {
    if (!selected || pending || revealed) return;
    setPending(true);
    setUnavailable(false);
    try {
      const result = await revealQotdAnswer(item.examSlug, dateIso, selected);
      if (!result) {
        setUnavailable(true);
        return;
      }
      setReveal(result);
      trackDailyAnswer(item.examSlug, result.isCorrect);
    } catch {
      setUnavailable(true);
    } finally {
      setPending(false);
    }
  }
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

        <div className="aee-landing-sample__options" role="listbox" aria-label="Answer choices">
          {item.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrectOpt = reveal !== null && opt === reveal.correctOption;
            const isWrong = reveal !== null && isSelected && opt !== reveal.correctOption;
            return (
              <button
                key={opt}
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
            );
          })}
        </div>

        {reveal === null ? (
          <>
            <button
              type="button"
              disabled={!selected || pending}
              onClick={() => void onCheck()}
              className="aee-landing-sample__check"
            >
              {pending ? "Checking…" : "Check answer"}
            </button>
            {unavailable ? (
              <p className="aee-landing-sample__rationale">
                This question isn’t available for that date.
              </p>
            ) : null}
          </>
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
              <strong>Rationale:</strong> {reveal.rationale}
            </p>
            <StudyUseNote className="mt-2" />
            <button
              type="button"
              className="aee-landing-sample__retry"
              onClick={() => {
                setSelected(null);
                setReveal(null);
                setUnavailable(false);
              }}
            >
              Try again
            </button>
          </div>
        )}
      </article>

      {revealed ? (
        <DailyTrialPitch board={item.examSlug} examName={examName} />
      ) : (
        <div className="aee-qotd__cta">
          <DailyTrialLink
            board={item.examSlug}
            placement="below_question"
            className="aee-flagship-cta aee-flagship-cta--primary aee-flagship-cta--hero"
          >
            Start 5-day free trial
          </DailyTrialLink>
          <p className="aee-qotd__cta-meta">{formatPricingCheckoutTrialOffer()}</p>
        </div>
      )}
      <Link
        href={examMarketingHref(item.examSlug)}
        prefetch={false}
        className="aee-qotd__secondary aee-qotd__secondary--block"
      >
        Explore {examName} prep →
      </Link>

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
