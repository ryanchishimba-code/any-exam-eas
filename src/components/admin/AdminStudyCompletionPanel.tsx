import type { AdminStudyCompletionBoardRow } from "@/lib/learning/study-completion/compute-study-completion";
import { EXAM_CATALOG } from "@/lib/edtech/exams";

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function AdminStudyCompletionPanel({ boards }: { boards: AdminStudyCompletionBoardRow[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Study completion (rules v1)</h2>
      <p className="mt-1 text-sm text-slate-500">
        Server-recorded pillars per board. Fast attempts are answers under five seconds or with no
        duration saved.
      </p>

      <div className="mt-6 space-y-6">
        {boards.map((board) => {
          const exam = EXAM_CATALOG[board.examSlug];
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
                {board.pillars.map((pillar) => (
                  <li key={pillar.id} className="flex justify-between gap-4 tabular-nums">
                    <span>{pillar.label}</span>
                    <span className={pillar.met ? "font-medium text-teal-700" : "text-slate-600"}>
                      {formatCount(pillar.done)} / {formatCount(pillar.target)}
                      {pillar.met ? " ✓" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
