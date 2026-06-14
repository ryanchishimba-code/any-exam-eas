"use client";

import type { ReactNode } from "react";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

export function QuestionBankSection({
  step,
  title,
  hint,
  children,
  className,
}: {
  step?: number;
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-start gap-3">
        {step != null ? <span className={qbUi.stepLabel}>{step}</span> : null}
        <div className="min-w-0 flex-1">
          <h3 className={qbUi.sectionTitle}>{title}</h3>
          {hint ? <p className={cn(qbUi.sectionHint, "mt-0.5")}>{hint}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function QuestionBankSegment<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className={qbUi.segmentTrack} role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(qbUi.segmentBtn, active && qbUi.segmentBtnActive)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
