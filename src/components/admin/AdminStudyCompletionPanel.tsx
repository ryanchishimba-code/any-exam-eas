import type { AdminStudyCompletionBoardRow } from "@/lib/learning/study-completion/compute-study-completion";
import { pillarCountLabel } from "@/lib/learning/study-completion/pillar-display";
import { EXAM_CATALOG } from "@/lib/edtech/exams";

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function AdminStudyCompletionPanel({ boards }: { boards: AdminStudyCompletionBoardRow[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Study completion (rules v2)</h2>
      <p className="mt-1 text-sm text-slate-500">
        Server-recorded pillars per board. Fast attempts are answers under five seconds or with no
        duration saved. Overall % uses weighted pillar progress (questions weighted highest).
      </p>

      <div className="mt-6 space-y-6">
        {boards.map((board) => {
          const exam = EXAM_CATALOG[board.examSlug];
          const estimate = board.readinessEstimate;
          return (
            <div
              key={board.examSlug}
              className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{exam.shortName}</h3>
                <span className="text-sm tabular-nums text-slate-600">
                  Overall {board.overallPercent}% · {board.ruleVersion}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Coverage {board.coveragePercent}% of {formatCount(board.liveBankCount)} live items ·
                Fast attempts excluded: {formatCount(board.fastAttemptsExcluded)}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {board.pillars.map((pillar) => {
                  const { primary, extraDone } = pillarCountLabel(pillar);
                  return (
                    <li key={pillar.id} className="flex flex-wrap justify-between gap-4 tabular-nums">
                      <span>{pillar.label}</span>
                      <span className={pillar.met ? "font-medium text-emerald-700" : "text-slate-600"}>
                        {primary}
                        {extraDone != null ? (
                          <span className="ml-1 font-normal text-slate-500">
                            ({formatCount(extraDone)} done)
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-slate-600">
                Readiness estimate:{" "}
                {estimate.status === "insufficient_data"
                  ? estimate.message
                  : `${estimate.score}/100 · ${estimate.band}`}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
