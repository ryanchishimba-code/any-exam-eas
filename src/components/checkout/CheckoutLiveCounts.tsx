import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";

/** Server-rendered live bank totals on checkout for trust before payment. */
export async function CheckoutLiveCounts() {
  const { display } = await loadPublicQuestionCounts();

  return (
    <p className="mx-auto mt-2 max-w-lg text-center text-sm text-[var(--color-ink-muted)]">
      {display.degraded ? (
        <>Access the full QA-gated question bank across all six board exams.</>
      ) : (
        <>
          <span className="font-semibold tabular-nums text-[var(--color-ink)]">
            {display.sentence || display.totalLabel}
          </span>
          {display.sentence ? "" : " active questions in the live bank."}
        </>
      )}
    </p>
  );
}
