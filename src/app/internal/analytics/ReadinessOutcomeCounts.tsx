import { countExamOutcomes } from "@/lib/learning/readiness-check/service";

const RESULT_LABEL: Record<string, string> = {
  passed: "Passed",
  not_yet: "Didn't pass yet",
  not_taken: "Haven't taken it",
};

/** Private counts only. No names, quotes, or public testimonials. */
export async function ReadinessOutcomeCounts() {
  let rows: Awaited<ReturnType<typeof countExamOutcomes>> = [];
  let failed = false;
  try {
    rows = await countExamOutcomes();
  } catch (error) {
    console.error("[internal] readiness outcomes", error);
    failed = true;
  }

  return (
    <section className="border-t border-black/10 pt-10">
      <h2 className="text-xl font-semibold tracking-tight">Exam outcomes</h2>
      <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-muted)]">
        Optional self-reports by board. Internal only. Do not publish these as testimonials or pass rates.
      </p>
      {failed ? (
        <p className="mt-4 text-sm text-amber-800">Outcome counts are unavailable right now.</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">No outcomes recorded yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-[var(--color-ink-muted)]">
                <th className="py-2 pr-4 font-medium">Board</th>
                <th className="py-2 pr-4 font-medium">Result</th>
                <th className="py-2 pr-4 font-medium">Responses</th>
                <th className="py-2 font-medium">Students</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.examSlug}-${row.result}`} className="border-b border-black/5">
                  <td className="py-2 pr-4 font-medium">{row.examSlug}</td>
                  <td className="py-2 pr-4">{RESULT_LABEL[row.result] ?? row.result}</td>
                  <td className="py-2 pr-4 tabular-nums">{row.responses}</td>
                  <td className="py-2 tabular-nums">{row.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
