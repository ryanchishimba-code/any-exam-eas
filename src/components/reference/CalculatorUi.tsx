import type { ReactNode } from "react";
import type { CalculationResult } from "@/lib/reference/calculations/clinical-calcs";

export function parsePositiveNum(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function parseNonNegativeNum(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function CalcField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-medium text-[var(--color-ink)]">{label}</span>
      {children}
      {hint ? (
        <span className="block text-[11px] text-[var(--color-ink-muted)]">{hint}</span>
      ) : null}
    </label>
  );
}

export function CalcResultBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
        {title}
      </p>
      <div className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--color-ink)]">
        {children}
      </div>
    </div>
  );
}

export function CalcFormulaBox({ formula }: { formula: string }) {
  return (
    <div
      className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-[13px] font-medium text-[var(--color-ink)]"
    >
      {formula}
    </div>
  );
}

export function CalcStepsBox({ steps }: { steps: string[] }) {
  return (
    <div
      className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-[12px] leading-relaxed text-[var(--color-ink-muted)]"
    >
      {steps.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

export function CalcResultPanel({
  result,
  title = "Result",
}: {
  result: CalculationResult;
  title?: string;
}) {
  return (
    <div className="space-y-3">
      <CalcFormulaBox formula={result.formula} />
      <CalcResultBox title={title}>
        <p className="text-[22px] font-semibold tabular-nums">
          {result.resultFormatted}{" "}
          <span className="text-[14px] font-normal">{result.resultUnit}</span>
        </p>
        {result.interpretation ? (
          <p className="text-[var(--color-ink-muted)]">{result.interpretation}</p>
        ) : null}
      </CalcResultBox>
      <CalcStepsBox steps={result.steps} />
    </div>
  );
}

export const calcPanelShell =
  "rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 sm:p-5";
