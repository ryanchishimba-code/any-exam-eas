"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { CONVERSION_EVENTS, trackConversion } from "@/lib/analytics";
import { dailyCtaLocation, dailyTrialHref, dailyTrialQuote, type DailyCtaPlacement } from "@/lib/marketing/daily-trial";
import { DailyInboxCapture } from "@/components/marketing/DailyInboxCapture";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

function trackTrialClick(board: string, placement: DailyCtaPlacement) {
  const location = dailyCtaLocation(placement);
  try {
    track("daily_trial_cta_click", { board, placement });
  } catch {
    /* Analytics must not block the signup link. */
  }
  trackConversion(CONVERSION_EVENTS.DAILY_TRIAL_CTA_CLICK, { board, location });
}

export function trackDailyAnswer(board: string, correct: boolean) {
  const result = correct ? "correct" : "miss";
  try {
    track("daily_answer", { board, result });
  } catch {
    /* non-blocking */
  }
  trackConversion(CONVERSION_EVENTS.DAILY_ANSWER, { board, result });
}

export function DailyTrialLink({
  board,
  placement,
  className,
  children,
}: {
  board: string;
  placement: DailyCtaPlacement;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={dailyTrialHref(board)}
      className={className}
      onClick={() => trackTrialClick(board, placement)}
    >
      {children}
    </Link>
  );
}

/** Fixed mobile bar. It is in the first HTML and does not push the page. */
export function DailyTrialSticky({ board }: { board: string }) {
  return (
    <div className="aee-qotd-sticky">
      <p>5-day free trial · no card</p>
      <DailyTrialLink
        board={board}
        placement="sticky"
        className="aee-flagship-cta aee-flagship-cta--primary"
      >
        Start
      </DailyTrialLink>
    </div>
  );
}

/** Shown after the free question is answered. */
export function DailyTrialPitch({
  board,
  examName,
}: {
  board: string;
  examName: string;
}) {
  const quote = dailyTrialQuote(board);
  return (
    <aside className="aee-qotd-trial" aria-label="Free trial">
      <p className="aee-qotd-trial__kicker">Next step</p>
      <p className="aee-qotd-trial__title">5-day free trial</p>
      <p className="aee-qotd-trial__detail">No card. {examName} questions, explained.</p>
      <DailyTrialLink
        board={board}
        placement="after_answer"
        className="aee-flagship-cta aee-flagship-cta--primary aee-flagship-cta--hero"
      >
        Start free trial
      </DailyTrialLink>
      <p className="aee-qotd-trial__meta">{formatPricingCheckoutTrialOffer()}</p>
      <DailyInboxCapture examSlug={board} />
      {quote ? (
        <figure className="aee-qotd-trial__quote">
          <blockquote>
            <p>{quote.quote}</p>
          </blockquote>
          <figcaption>
            {quote.name} · {quote.exam}
          </figcaption>
        </figure>
      ) : null}
    </aside>
  );
}
