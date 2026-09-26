"use client";

import { RationalePanel } from "@/components/ngn/RationalePanel";
import { McSingle, Sata, SelectN } from "@/components/ngn/items/ChoiceItems";
import { DropdownCloze } from "@/components/ngn/items/DropdownItems";
import { HighlightText } from "@/components/ngn/items/HighlightText";
import { MatrixMC, MatrixMR } from "@/components/ngn/items/MatrixItems";
import { BowTie, emptyBowTie, type BowTieValue } from "@/components/ngn/items/BowTie";
import { TrendExhibit } from "@/components/ngn/items/TrendExhibit";
import type { NgnItem, NgnOption, NgnReference, SourceRef } from "@/lib/assessment/types";

type ItemRendererProps = {
  item: NgnItem;
  seed: string;
  response: unknown;
  onChange: (response: unknown) => void;
  disabled?: boolean;
  showRationale?: boolean;
  sourcesById?: Record<string, Pick<SourceRef, "title" | "url"> | undefined>;
  caseReferences?: NgnReference[];
};

function options(value: unknown): NgnOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { id?: unknown; text?: unknown };
    if (typeof record.id !== "string" || typeof record.text !== "string") return [];
    return [{ id: record.id, text: record.text }];
  });
}

function columns(value: unknown): { id: string; label: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { id?: unknown; label?: unknown };
    if (typeof record.id !== "string" || typeof record.label !== "string") return [];
    return [{ id: record.id, label: record.label }];
  });
}

function rows(value: unknown): { id: string; text: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { id?: unknown; text?: unknown };
    if (typeof record.id !== "string" || typeof record.text !== "string") return [];
    return [{ id: record.id, text: record.text }];
  });
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function recordOfStrings(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") out[key] = entry;
  }
  return out;
}

function recordOfLists(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string[]> = {};
  for (const [key, entry] of Object.entries(value)) out[key] = stringList(entry);
  return out;
}

function bowTieValue(value: unknown): BowTieValue {
  const empty = emptyBowTie();
  if (!value || typeof value !== "object" || Array.isArray(value)) return empty;
  const record = value as { condition?: unknown; actions?: unknown; monitor?: unknown };
  const actions = stringList(record.actions);
  const monitor = stringList(record.monitor);
  return {
    condition: typeof record.condition === "string" ? record.condition : null,
    actions: [actions[0] ?? null, actions[1] ?? null],
    monitor: [monitor[0] ?? null, monitor[1] ?? null],
  };
}

function bowTieResponse(value: BowTieValue) {
  return {
    condition: value.condition,
    actions: value.actions.filter((id): id is string => Boolean(id)),
    monitor: value.monitor.filter((id): id is string => Boolean(id)),
  };
}

function tokens(value: unknown): { id?: string; text: string; selectable?: boolean }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { id?: unknown; text?: unknown; selectable?: unknown };
    if (typeof record.text !== "string") return [];
    return [
      {
        id: typeof record.id === "string" ? record.id : undefined,
        text: record.text,
        selectable: record.selectable === true,
      },
    ];
  });
}

export function ItemRenderer({
  item,
  seed,
  response,
  onChange,
  disabled,
  showRationale,
  sourcesById = {},
  caseReferences,
}: ItemRendererProps) {
  const payload = item.payload;
  let control = null;
  if (item.responseFormat === "highlight_text") {
    control = (
      <HighlightText
        tokens={tokens(payload.tokens)}
        selected={stringList(response)}
        onChange={onChange}
        disabled={disabled}
      />
    );
  } else if (item.responseFormat === "mc_single") {
    control = (
      <McSingle
        options={options(payload.options)}
        seed={seed}
        name={item.id}
        value={typeof response === "string" ? response : null}
        onChange={onChange}
        disabled={disabled}
      />
    );
  } else if (item.responseFormat === "mr_sata") {
    control = (
      <Sata
        options={options(payload.options)}
        seed={seed}
        selected={stringList(response)}
        onChange={onChange}
        disabled={disabled}
      />
    );
  } else if (item.responseFormat === "mr_select_n") {
    control = (
      <SelectN
        options={options(payload.options)}
        n={typeof payload.n === "number" ? payload.n : 0}
        seed={seed}
        selected={stringList(response)}
        onChange={onChange}
        disabled={disabled}
      />
    );
  } else if (item.responseFormat === "matrix_mc") {
    control = (
      <MatrixMC
        columns={columns(payload.columns)}
        rows={rows(payload.rows)}
        value={recordOfStrings(response)}
        onChange={onChange}
        disabled={disabled}
        name={item.id}
      />
    );
  } else if (item.responseFormat === "matrix_mr") {
    control = (
      <MatrixMR
        columns={columns(payload.columns)}
        rows={rows(payload.rows)}
        value={recordOfLists(response)}
        onChange={onChange}
        disabled={disabled}
      />
    );
  } else if (item.responseFormat === "dropdown_cloze" || item.responseFormat === "dropdown_rationale") {
    const dropdowns = Array.isArray(payload.dropdowns)
      ? payload.dropdowns.flatMap((entry) => {
          if (!entry || typeof entry !== "object") return [];
          const record = entry as { id?: unknown; role?: unknown; options?: unknown };
          if (typeof record.id !== "string") return [];
          return [
            {
              id: record.id,
              role: typeof record.role === "string" ? record.role : undefined,
              options: options(record.options),
            },
          ];
        })
      : [];
    control = (
      <DropdownCloze
        template={typeof payload.template === "string" ? payload.template : ""}
        dropdowns={dropdowns}
        format={item.responseFormat}
        seed={seed}
        value={recordOfStrings(response)}
        onChange={onChange}
        disabled={disabled}
      />
    );
  } else if (item.responseFormat === "bowtie") {
    const block = (key: "condition" | "actions" | "monitor") => {
      const value = payload[key];
      if (!value || typeof value !== "object") return [];
      return options((value as { options?: unknown }).options);
    };
    control = (
      <BowTie
        condition={block("condition")}
        actions={block("actions")}
        monitor={block("monitor")}
        seed={seed}
        value={bowTieValue(response)}
        onChange={(next) => onChange(bowTieResponse(next))}
        disabled={disabled}
      />
    );
  }

  const exhibit =
    item.exhibit && typeof item.exhibit === "object"
      ? (item.exhibit as { title?: string; columns?: unknown; rows?: unknown; note?: string; text?: string })
      : null;

  return (
    <div className="space-y-6">
      {item.itemType === "trend" ? <TrendExhibit exhibit={exhibit} /> : null}
      {item.itemType === "bowtie" && exhibit?.text ? (
        <aside className="rounded-3xl bg-[#f4f6f8] p-4">
          {exhibit.title ? <p className="text-sm font-semibold text-[#0A2540]">{exhibit.title}</p> : null}
          <p className="mt-2 text-[15px] leading-6 text-[#0A2540]">{exhibit.text}</p>
        </aside>
      ) : null}
      {control}
      {showRationale ? (
        <RationalePanel
          item={item}
          response={response}
          sourcesById={sourcesById}
          caseReferences={caseReferences}
        />
      ) : null}
    </div>
  );
}
