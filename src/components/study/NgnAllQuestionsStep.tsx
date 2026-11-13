"use client";

import { CaseStudyPlayer } from "@/components/ngn/CaseStudyPlayer";
import { InlineBold } from "@/components/ngn/InlineBold";
import { ItemRenderer } from "@/components/ngn/ItemRenderer";
import type { NclexAllNgnSlot } from "@/lib/assessment/nclex-all-ngn-slot";
import type { NgnItem } from "@/lib/assessment/types";

type Props = {
  slot: NclexAllNgnSlot;
  seed: string;
  responses: Record<string, unknown>;
  revealedItem?: NgnItem | null;
  revealed: boolean;
  onResponsesChange: (responses: Record<string, unknown>) => void;
  hint?: string | null;
};

/** Official NGN item inside the All-questions card. The session owns Check, Next, and the timer. */
export function NgnAllQuestionsStep({
  slot,
  seed,
  responses,
  revealedItem,
  revealed,
  onResponsesChange,
  hint,
}: Props) {
  const item = revealedItem ?? slot.item;
  if (slot.role === "standalone" || !slot.caseDoc) {
    return (
      <div data-nclex-all-ngn="standalone">
        <h2 className="text-[19px] font-semibold leading-7 tracking-tight text-[var(--color-ink)]">
          <InlineBold text={item.stem} />
        </h2>
        <div className="mt-5">
          <ItemRenderer
            item={item}
            seed={seed}
            response={responses[item.id]}
            onChange={(next) => onResponsesChange({ ...responses, [item.id]: next })}
            disabled={revealed}
            showRationale={revealed}
            sourcesById={slot.sourcesById}
          />
        </div>
      </div>
    );
  }

  const items = slot.caseItems.map((entry) => (entry.id === item.id ? item : entry));
  return (
    <div data-nclex-all-ngn="case">
      {hint ? <p className="mb-3 text-sm text-[var(--color-ink-muted)]">{hint}</p> : null}
      <CaseStudyPlayer
        key={`${slot.setId ?? item.id}:${slot.stepIndex}:${revealed ? "review" : "exam"}`}
        caseDoc={{ ...slot.caseDoc, items }}
        items={items}
        mode={revealed ? "review" : "exam"}
        attemptSeed={seed}
        initialStep={Math.max(0, slot.stepIndex - 1)}
        initialResponses={responses}
        sourcesById={slot.sourcesById}
        rationaleVisible={revealed}
        externalNavigation
        onResponsesChange={onResponsesChange}
      />
    </div>
  );
}
