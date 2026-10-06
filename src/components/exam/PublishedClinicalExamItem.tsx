"use client";

import { ChartPanel } from "@/components/ngn/ChartPanel";
import { ItemRenderer } from "@/components/ngn/ItemRenderer";
import {
  decodeClinicalResponse,
  encodeClinicalResponse,
  type PublishedClinicalAttachment,
} from "@/lib/full-exam/published-clinical-exam";

type Props = {
  clinical: PublishedClinicalAttachment;
  seed: string;
  selected: string[];
  disabled?: boolean;
  onToggle: (option: string) => void;
};

/** Published ngn_item row inside a full exam. The chart stops at this step's timepoint. */
export function PublishedClinicalExamItem({ clinical, seed, selected, disabled, onToggle }: Props) {
  const { item, caseDoc } = clinical;
  const response = decodeClinicalResponse(selected);
  return (
    <div className="space-y-4">
      {caseDoc ? (
        <div className="space-y-3">
          <p className="text-[13px] leading-6 text-[var(--color-ink)]">
            <span className="font-semibold">{caseDoc.patient.displayName}</span>
            <span className="text-[var(--color-ink-muted)]">
              {" "}
              · {caseDoc.patient.age} years · {caseDoc.patient.weightKg} kg · allergies {caseDoc.patient.allergies}
            </span>
          </p>
          <ChartPanel
            chart={caseDoc.chart}
            timepoints={caseDoc.timepoints}
            currentTimepoint={item.timepoint ?? ""}
          />
        </div>
      ) : null}
      <h2 className="text-lg font-medium leading-snug text-[var(--color-ink)] sm:text-xl">{item.stem}</h2>
      <ItemRenderer
        item={item}
        seed={seed}
        response={response}
        disabled={disabled}
        onChange={(next) => onToggle(encodeClinicalResponse(next))}
      />
    </div>
  );
}
