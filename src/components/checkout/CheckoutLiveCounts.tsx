import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

/** Server-rendered live bank totals on checkout for trust before payment. */
export async function CheckoutLiveCounts() {
  const snapshot = await getCachedQuestionBankCounts();
  const display = buildLandingBankCountsDisplay(snapshot);

  return (
    <p className="mx-auto mt-2 max-w-lg text-center text-sm text-[var(--color-ink-muted)]">
      {display.degraded ? (
        <>Access the full QA-gated question bank across all six board exams.</>
      ) : (
        <>
          <span className="font-semibold tabular-nums text-[var(--color-ink)]">
            {display.totalLabel}
          </span>{" "}
          serve-ready questions in the live bank today.
        </>
      )}
    </p>
  );
}
