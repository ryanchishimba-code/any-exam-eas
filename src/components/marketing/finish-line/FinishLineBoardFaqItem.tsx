import Link from "next/link";
import {
  FINISH_LINE_FAQ_ANSWER,
  FINISH_LINE_FAQ_QUESTION,
  FINISH_LINE_TERMS_PATH,
  isFinishLineOfferEnabled,
} from "@/lib/marketing/finish-line-offer";

/** Extra FAQ block for board landings (not included in FAQ schema). */
export function FinishLineBoardFaqItem() {
  if (!isFinishLineOfferEnabled()) return null;
  return (
    <details>
      <summary>
        <h3>{FINISH_LINE_FAQ_QUESTION}</h3>
      </summary>
      <p>
        {FINISH_LINE_FAQ_ANSWER}{" "}
        <Link
          href={FINISH_LINE_TERMS_PATH}
          prefetch={false}
          className="font-semibold text-[var(--color-accent)] underline underline-offset-2"
        >
          See terms
        </Link>
      </p>
    </details>
  );
}

export function FinishLineExamFaqItem() {
  if (!isFinishLineOfferEnabled()) return null;
  return (
    <div className="border-b border-[var(--color-border)] pb-6">
      <dt className="text-base font-bold text-[var(--color-ink)]">{FINISH_LINE_FAQ_QUESTION}</dt>
      <dd className="mt-2 text-base leading-relaxed text-[var(--color-ink-muted)]">
        {FINISH_LINE_FAQ_ANSWER}{" "}
        <Link
          href={FINISH_LINE_TERMS_PATH}
          prefetch={false}
          className="font-semibold text-[var(--color-accent)] underline underline-offset-2"
        >
          See terms
        </Link>
      </dd>
    </div>
  );
}
