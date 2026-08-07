"use client";

import type {
  ComparisonTableVisual,
  FlowVisual,
  LabTableVisual,
  VisualRationaleBlock,
} from "@/lib/engine/rationale/visual-rationale-types";
import { cn } from "@/lib/utils";
import { Activity, GitBranch, Table2 } from "lucide-react";

function LabTableBlock({ block }: { block: LabTableVisual }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]/70 bg-white/80 dark:bg-[var(--color-surface)]/80">
      <table className="w-full min-w-[280px] text-left text-sm">
        <caption className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {block.title}
        </caption>
        <thead>
          <tr className="border-b border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]/60">
            <th className="px-3 py-2 font-semibold text-[var(--color-ink)]">Finding</th>
            <th className="px-3 py-2 font-semibold text-[var(--color-ink)]">Value</th>
            <th className="hidden px-3 py-2 font-semibold text-[var(--color-ink-muted)] sm:table-cell">
              Reference
            </th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr
              key={row.label}
              className={cn(
                "border-b border-[var(--color-border)]/40 last:border-0",
                row.abnormal && "bg-rose-50/70 dark:bg-rose-950/25"
              )}
            >
              <td className="px-3 py-2 font-medium text-[var(--color-ink)]">{row.label}</td>
              <td
                className={cn(
                  "px-3 py-2 font-semibold tabular-nums",
                  row.abnormal ? "text-rose-700 dark:text-rose-300" : "text-[var(--color-ink)]"
                )}
              >
                {row.value}
                {row.abnormal ? (
                  <span className="ml-1.5 text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">
                    ↑↓
                  </span>
                ) : null}
              </td>
              <td className="hidden px-3 py-2 text-[var(--color-ink-muted)] sm:table-cell">
                {row.reference ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonBlock({ block }: { block: ComparisonTableVisual }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]/70">
      <p className="border-b border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        {block.title}
      </p>
      <table className="w-full min-w-[320px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]/60">
            {block.headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold text-[var(--color-ink)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]/40 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-[var(--color-ink-muted)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlowBlock({ block }: { block: FlowVisual }) {
  return (
    <div className="rounded-lg border border-sky-200/60 bg-sky-50/40 p-3 dark:border-sky-900/40 dark:bg-sky-950/20">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">
        <GitBranch className="h-3.5 w-3.5" aria-hidden />
        {block.title}
      </p>
      <ol className="space-y-2">
        {block.steps.map((step, i) => (
          <li key={step} className="flex gap-2 text-sm text-[var(--color-ink)]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function blockIcon(kind: VisualRationaleBlock["kind"]) {
  if (kind === "lab_table") return Table2;
  if (kind === "flow") return GitBranch;
  return Activity;
}

export function RationaleVisualPanel({ blocks }: { blocks: VisualRationaleBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  const safeBlocks = blocks.filter((block) => {
    if (!block || typeof block !== "object" || !("kind" in block)) return false;
    if (block.kind === "lab_table") return Array.isArray(block.rows);
    if (block.kind === "comparison") {
      return Array.isArray(block.headers) && Array.isArray(block.rows);
    }
    if (block.kind === "flow") return Array.isArray(block.steps);
    return false;
  });

  if (safeBlocks.length === 0) return null;

  return (
    <div className="space-y-3" aria-label="Visual rationale aids">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        <Table2 className="h-3.5 w-3.5" aria-hidden />
        Clinical reference
      </p>
      {safeBlocks.map((block) => {
        const Icon = blockIcon(block.kind);
        return (
          <div key={`${block.kind}-${block.title}`}>
            {block.kind === "lab_table" ? (
              <LabTableBlock block={block} />
            ) : block.kind === "comparison" ? (
              <ComparisonBlock block={block} />
            ) : (
              <FlowBlock block={block} />
            )}
            <span className="sr-only">
              {Icon.name} {block.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
