import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

type StoredAttempt = {
  questionKey?: string;
  bankItemId?: string | null;
  stemPreview?: string | null;
  correct?: boolean;
  selectedAnswer?: string | null;
};

function readAttempts(stateJson: string): { format: "ngn" | "case" | null; attempts: StoredAttempt[] } {
  try {
    const parsed = JSON.parse(stateJson) as {
      session?: { practiceFormat?: string };
      attempts?: StoredAttempt[];
    };
    const format =
      parsed.session?.practiceFormat === "case" || parsed.session?.practiceFormat === "ngn"
        ? parsed.session.practiceFormat
        : null;
    return { format, attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [] };
  } catch {
    return { format: null, attempts: [] };
  }
}

export default async function SavedFormatSetPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/analytics/sets/${sessionId}`);
  }
  await requirePremiumPage(`/analytics/sets/${sessionId}`);

  const row = await prisma.studySession.findFirst({
    where: { id: sessionId, userId: session.user.id, completed: true },
    select: { score: true, updatedAt: true, stateJson: true, fieldId: true },
  });
  if (!row) notFound();

  const stored = readAttempts(row.stateJson);
  if (!stored.format) notFound();

  const ids = stored.attempts
    .map((attempt) => attempt.bankItemId || attempt.questionKey)
    .filter((id): id is string => Boolean(id));
  const bank =
    ids.length > 0
      ? await prisma.questionBankItem.findMany({
          where: { id: { in: ids } },
          select: { id: true, question: true },
        })
      : [];
  const stems = new Map(bank.map((item) => [item.id, item.question]));
  const score = row.score == null ? null : Math.round(row.score);
  const title =
    stored.format === "case"
      ? "Saved case set"
      : row.fieldId === "nursing"
        ? "Saved NGN set"
        : row.fieldId === "pharmacy"
          ? "Saved select-all set"
          : "Saved practice set";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
          {title}
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
          {score == null ? "Saved" : `${score}%`}
        </h1>
        <p className="text-[15px] text-[var(--color-ink-muted)]">
          {stored.attempts.length} {stored.attempts.length === 1 ? "item" : "items"} ·{" "}
          {row.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <ol className="space-y-3">
        {stored.attempts.map((attempt, index) => {
          const id = attempt.bankItemId || attempt.questionKey || "";
          const stem = (id && stems.get(id)) || attempt.stemPreview || "Question";
          return (
            <li
              key={`${id}-${index}`}
              className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] px-4 py-4"
            >
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                Item {index + 1} · {attempt.correct ? "Correct" : "Incorrect"}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]">{stem}</p>
              {attempt.selectedAnswer ? (
                <p className="mt-2 text-[14px] text-[var(--color-ink-muted)]">
                  Your answer: {attempt.selectedAnswer}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      <Link href={ROUTES.analytics} className="inline-flex text-[14px] font-semibold text-[var(--color-accent)]">
        Back to analytics
      </Link>
    </div>
  );
}
