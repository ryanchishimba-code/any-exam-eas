import type { AdminStudyProof } from "@/lib/engagement/admin-study-proof";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { pillarCountLabel } from "@/lib/learning/study-completion/pillar-display";
import { AdminStudyProofExportButton } from "@/components/admin/AdminStudyProofExportButton";

function formatHours(h: number): string {
  return h.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function AdminStudyProofPanel({ proof, userId }: { proof: AdminStudyProof; userId: string }) {
  const maxDaySeconds = Math.max(1, ...proof.dailyActivity.map((d) => d.totalSeconds));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Study proof (server-verified)</h2>
          <p className="mt-1 text-sm text-slate-500">
            Engagement heartbeats, attempt durations, and completion pillars for dispute review.
          </p>
        </div>
        <AdminStudyProofExportButton userId={userId} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active hours (90d)</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
            {formatHours(proof.totals.activeHoursOverall)}
          </p>
          <p className="text-xs text-slate-500">{proof.totals.activeDays} days with activity</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Question time (cross-check)
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
            {formatHours(proof.totals.questionAttemptHoursCapped)} h
          </p>
          <p className="text-xs text-slate-500">Capped at 5 min per attempt</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Hours by surface</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
            {Object.entries(proof.totals.hoursBySurface).map(([surface, hours]) => (
              <li key={surface} className="flex justify-between tabular-nums">
                <span className="text-slate-600">{surface}</span>
                <span>{formatHours(hours)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-900">Daily activity (last 30 days, Central)</h3>
        <div
          className="mt-3 flex h-24 items-end gap-0.5"
          role="img"
          aria-label="Bar chart of daily active seconds for the last 30 days"
        >
          {proof.dailyActivity.map((day) => {
            const height = Math.round((day.totalSeconds / maxDaySeconds) * 100);
            return (
              <div
                key={day.date}
                className="min-w-0 flex-1 rounded-t bg-cyan-600/80"
                style={{ height: `${Math.max(day.totalSeconds > 0 ? 8 : 2, height)}%` }}
                title={`${day.date}: ${Math.round(day.totalSeconds / 60)} min`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-900">Integrity flags</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>
            Fast answers (&lt;5s): {proof.integrity.fastAnswersUnder5s} of{" "}
            {proof.integrity.totalAnswers} ({proof.integrity.fastAnswerPercent}%)
          </li>
          <li>Answer bursts (&gt;30/min): {proof.integrity.answerBurstsOver30PerMinute} minutes</li>
          <li>Heartbeats ignored (too fast): {proof.integrity.heartbeatsIgnoredTooFast}</li>
          <li>Exam sittings ended early: {proof.integrity.examsEndedEarly}</li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-900">Completion pillars ({proof.ruleVersion})</h3>
        <div className="mt-3 space-y-4">
          {proof.completionBoards.map((board) => (
            <div key={board.examSlug} className="rounded-lg border border-slate-100 p-3">
              <p className="text-sm font-medium text-slate-900">
                {EXAM_CATALOG[board.examSlug].shortName} · {board.overallPercent}%
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {board.pillars.map((pillar) => {
                  const { primary, extraDone } = pillarCountLabel(pillar);
                  return (
                    <li key={pillar.id} className="flex justify-between gap-2 tabular-nums">
                      <span>{pillar.label}</span>
                      <span>
                        {primary}
                        {extraDone != null ? ` (${extraDone} done)` : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-900">Activity timeline (last 200 events)</h3>
        <div className="mt-2 max-h-96 overflow-y-auto rounded-lg border border-slate-100">
          <table className="min-w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Time (CT)</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Detail</th>
                <th className="px-3 py-2 font-medium">Board</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {proof.timeline.map((row, index) => (
                <tr key={`${row.atIso}-${index}`}>
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums">{row.at}</td>
                  <td className="px-3 py-2">{row.type}</td>
                  <td className="px-3 py-2">{row.detail}</td>
                  <td className="px-3 py-2">{row.board}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
