import { loadJudgmentPilotPerformance } from "@/lib/judgment-pilot/performance-stats";
import { JUDGMENT10_BATCH_ID } from "@/lib/judgment-pilot/constants";

export const metadata = {
  title: "Judgment pilot — Admin",
};

export default async function JudgmentPilotAdminPage() {
  const report = await loadJudgmentPilotPerformance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Clinical judgment pilot</h1>
        <p className="mt-1 text-sm text-slate-500">
          Batch <code className="rounded bg-slate-100 px-1">{JUDGMENT10_BATCH_ID}</code> — student
          performance from persisted <code className="rounded bg-slate-100 px-1">QuestionAttempt</code>{" "}
          rows (read-only; no extra client tracking).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p>
          <span className="font-medium">Totals:</span> {report.totals.attempts} attempts from{" "}
          {report.totals.uniqueStudents} students —{" "}
          {report.totals.pctCorrect == null ? "no scored attempts yet" : `${report.totals.pctCorrect}% correct`}
        </p>
        <p className="mt-1 text-xs text-slate-500">Snapshot: {report.generatedAt}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Pilot ID</th>
              <th className="px-4 py-3">Board</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Attempts</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">% correct</th>
              <th className="px-4 py-3">Avg time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {report.items.map((row) => (
              <tr key={row.bankItemId}>
                <td className="px-4 py-3 font-mono text-xs">{row.pilotItemId}</td>
                <td className="px-4 py-3">{row.fieldId === "nursing" ? "NCLEX-RN" : "NAPLEX"}</td>
                <td className="px-4 py-3">{row.itemType}</td>
                <td className="px-4 py-3">{row.attempts}</td>
                <td className="px-4 py-3">{row.uniqueStudents}</td>
                <td className="px-4 py-3">
                  {row.pctCorrect == null ? "—" : `${row.pctCorrect}%`}
                </td>
                <td className="px-4 py-3">
                  {row.avgDurationMs == null ? "—" : `${(row.avgDurationMs / 1000).toFixed(1)}s`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        CLI equivalent:{" "}
        <code className="rounded bg-slate-100 px-1">npx tsx scripts/report-judgment10-performance.ts</code>
      </p>
    </div>
  );
}
