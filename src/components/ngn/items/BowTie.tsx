"use client";

import { useState } from "react";
import { ngnFocus } from "@/components/ngn/brand";
import { orderForFormat } from "@/lib/assessment/shuffle";
import type { NgnOption } from "@/lib/assessment/types";

export type BowTieValue = {
  condition: string | null;
  actions: [string | null, string | null];
  monitor: [string | null, string | null];
};

export const emptyBowTie = (): BowTieValue => ({
  condition: null,
  actions: [null, null],
  monitor: [null, null],
});

type Part = "condition" | "actions" | "monitor";

const PARTS: { id: Part; label: string; slots: 1 | 2 }[] = [
  { id: "actions", label: "Actions to take", slots: 2 },
  { id: "condition", label: "Condition", slots: 1 },
  { id: "monitor", label: "Parameters to monitor", slots: 2 },
];

function placedIds(value: BowTieValue, part: Part): (string | null)[] {
  if (part === "condition") return [value.condition];
  return value[part];
}

export function BowTie({
  condition,
  actions,
  monitor,
  seed,
  value,
  onChange,
  disabled,
}: {
  condition: NgnOption[];
  actions: NgnOption[];
  monitor: NgnOption[];
  seed: string;
  value: BowTieValue;
  onChange: (next: BowTieValue) => void;
  disabled?: boolean;
}) {
  const banks: Record<Part, NgnOption[]> = {
    condition: orderForFormat("bowtie", condition, `${seed}:condition`),
    actions: orderForFormat("bowtie", actions, `${seed}:actions`),
    monitor: orderForFormat("bowtie", monitor, `${seed}:monitor`),
  };
  const [picked, setPicked] = useState<{ part: Part; id: string } | null>(null);

  function textFor(part: Part, id: string | null) {
    if (!id) return "";
    return banks[part].find((option) => option.id === id)?.text ?? id;
  }

  function place(part: Part, slot: number, id: string) {
    if (disabled) return;
    const next: BowTieValue = {
      condition: value.condition,
      actions: [value.actions[0], value.actions[1]],
      monitor: [value.monitor[0], value.monitor[1]],
    };
    if (part === "condition") {
      next.condition = id;
    } else {
      const slots: [string | null, string | null] = [next[part][0], next[part][1]];
      const existing = slots.findIndex((entry) => entry === id);
      if (existing >= 0) slots[existing] = null;
      slots[slot] = id;
      next[part] = slots;
    }
    onChange(next);
    setPicked(null);
  }

  function clear(part: Part, slot: number) {
    const next: BowTieValue = {
      condition: value.condition,
      actions: [value.actions[0], value.actions[1]],
      monitor: [value.monitor[0], value.monitor[1]],
    };
    if (part === "condition") next.condition = null;
    else {
      const slots: [string | null, string | null] = [next[part][0], next[part][1]];
      slots[slot] = null;
      next[part] = slots;
    }
    onChange(next);
  }

  function onDrop(part: Part, slot: number, raw: string) {
    try {
      const data = JSON.parse(raw) as { part?: Part; id?: string };
      if (data.part === part && data.id) place(part, slot, data.id);
    } catch {
      /* Ignore a drop that is not one of our tokens. */
    }
  }

  return (
    <div className="space-y-5">
      <p id="bowtie-help" className="text-sm leading-6 text-[#334155]">
        Drag a token into a slot, or select a token and then activate a slot.
      </p>
      <div className="grid gap-3 lg:grid-cols-3">
        {PARTS.map((part) => (
          <section key={part.id} aria-label={part.label} className="rounded-3xl bg-[#f4f6f8] p-3">
            <h3 className="px-1 text-sm font-semibold text-[#0A2540]">{part.label}</h3>
            <div className="mt-2 space-y-2">
              {placedIds(value, part.id).map((id, slot) => (
                <div
                  key={`${part.id}-${slot}`}
                  data-testid={`bowtie-slot-${part.id}-${slot}`}
                  className="flex min-h-16 items-center justify-between gap-2 rounded-2xl border border-dashed border-[#0A2540]/25 bg-white px-3 py-2"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    onDrop(part.id, slot, event.dataTransfer.getData("text/plain"));
                  }}
                >
                  <button
                    type="button"
                    disabled={disabled}
                    aria-describedby="bowtie-help"
                    className={`min-h-11 flex-1 text-left text-sm leading-5 text-[#0A2540] ${ngnFocus}`}
                    onClick={() => {
                      if (picked?.part === part.id) place(part.id, slot, picked.id);
                    }}
                  >
                    {id ? textFor(part.id, id) : "Empty slot"}
                  </button>
                  {id ? (
                    <button
                      type="button"
                      className={`min-h-11 shrink-0 text-sm font-medium text-[#0A2540] underline decoration-[#00D4C8] underline-offset-4 ${ngnFocus}`}
                      onClick={() => clear(part.id, slot)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <ul className="mt-3 space-y-2">
              {banks[part.id]
                .filter((option) => !placedIds(value, part.id).includes(option.id))
                .map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      draggable={!disabled}
                      aria-pressed={picked?.part === part.id && picked.id === option.id}
                      aria-describedby="bowtie-help"
                      disabled={disabled}
                      className={`min-h-11 w-full rounded-2xl px-3 py-2 text-left text-sm leading-5 text-[#0A2540] motion-reduce:transition-none ${ngnFocus} ${
                        picked?.part === part.id && picked.id === option.id
                          ? "bg-[#0A2540] text-white"
                          : "bg-white ring-1 ring-[#e2e8f0] hover:bg-[#E5FBF9]"
                      }`}
                      onDragStart={(event) => {
                        event.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ part: part.id, id: option.id })
                        );
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onClick={() =>
                        setPicked((current) =>
                          current?.id === option.id && current.part === part.id
                            ? null
                            : { part: part.id, id: option.id }
                        )
                      }
                    >
                      {option.text}
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
