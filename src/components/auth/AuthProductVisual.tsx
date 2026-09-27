import { getLandingMcqSample } from "@/lib/demo/landing-samples";

const LETTERS = ["A", "B", "C", "D"] as const;

/**
 * Desktop product frame. The stem, choices, and rationale are the published
 * NCLEX landing sample — the same fixture the home page practices from.
 */
export function AuthProductVisual() {
  const sample = getLandingMcqSample("nclex");

  return (
    <aside className="aee-auth-visual" aria-hidden="true">
      <div className="aee-auth-device">
        <div className="aee-auth-device-bar">
          <span>Question bank</span>
          <span>{sample.examLabel}</span>
        </div>
        <p className="aee-auth-device-stem">{sample.stem}</p>
        <ol className="aee-auth-device-options">
          {sample.options.map((option, index) => {
            const correct = option === sample.correct;
            return (
              <li key={option} data-correct={correct ? "true" : "false"}>
                <span>{LETTERS[index] ?? String(index + 1)}</span>
                {option}
              </li>
            );
          })}
        </ol>
        <div className="aee-auth-device-rationale">
          <p>Rationale</p>
          <p>{sample.rationale}</p>
        </div>
      </div>
      <p className="aee-auth-device-caption">Every question explained.</p>
    </aside>
  );
}
