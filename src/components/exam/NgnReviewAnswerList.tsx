import { InlineBold } from "@/components/ngn/InlineBold";
import { ngnReviewLines, shouldUseNgnReviewDisplay } from "@/lib/full-exam/ngn-review-display";
import { cn } from "@/lib/utils";

export function NgnReviewAnswerList({
  selected,
  correctAnswer,
  ngnFormat,
  optionsLength,
}: {
  selected: string;
  correctAnswer: string;
  ngnFormat?: string;
  optionsLength: number;
}) {
  if (
    !shouldUseNgnReviewDisplay({
      ngnFormat,
      optionsLength,
      selected,
      correctAnswer,
    })
  ) {
    return null;
  }

  const lines = ngnReviewLines({ selected, correctAnswer, ngnFormat });
  if (lines.length === 0) return null;

  const paired = lines.some((line) => line.label.length > 0);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <tr>
            {paired ? <th className="px-3 py-2">Item</th> : null}
            <th className="px-3 py-2">Your answer</th>
            <th className="px-3 py-2">Correct</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr key={`${line.label}-${index}`} className="border-t border-slate-100">
              {paired ? (
                <td className="px-3 py-2.5 font-medium text-slate-700">
                  <InlineBold text={line.label} />
                </td>
              ) : null}
              <td
                className={cn(
                  "px-3 py-2.5",
                  line.match ? "text-teal-800" : "text-rose-700"
                )}
              >
                <InlineBold text={line.yourText} />
              </td>
              <td className="px-3 py-2.5 text-teal-800">
                <InlineBold text={line.correctText} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
