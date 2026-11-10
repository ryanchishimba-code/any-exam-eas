"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const KEYS = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+"] as const;

function applyKey(current: string, key: string): string {
  if (key === "C") return "";
  if (key === "." && current.endsWith(".")) return current;
  return `${current}${key}`.slice(0, 32);
}

function evaluateExpression(expression: string): string {
  const cleaned = expression.replace(/[^0-9.+\-*/]/g, "");
  if (!cleaned || /[+\-*/.]$/.test(cleaned)) return expression;
  const parts = cleaned.split(/([+\-*/])/).filter((part) => part.length > 0);
  if (parts.length < 3) return expression;
  let total = Number(parts[0]);
  if (!Number.isFinite(total)) return expression;
  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i];
    const next = Number(parts[i + 1]);
    if (!Number.isFinite(next)) return expression;
    if (op === "+") total += next;
    else if (op === "-") total -= next;
    else if (op === "*") total *= next;
    else if (op === "/" && next !== 0) total /= next;
    else return expression;
  }
  const rounded = Math.round(total * 10000) / 10000;
  return String(rounded);
}

/** Four-function calculator for numeric exams. It does not submit an answer. */
export function ExamCalculator({ className }: { className?: string }) {
  const [expression, setExpression] = useState("");
  return (
    <div className={cn("w-56 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-lg", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">Calculator</p>
      <output className="mt-2 block min-h-9 truncate rounded-lg bg-black/[0.04] px-2 py-1.5 text-right font-mono text-[16px] text-[var(--color-ink)]">
        {expression || "0"}
      </output>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setExpression((current) => applyKey(current, key))}
            className="rounded-lg bg-black/[0.04] px-2 py-2 text-[14px] font-semibold text-[var(--color-ink)] hover:bg-black/[0.08]"
          >
            {key}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setExpression((current) => evaluateExpression(current))}
        className="mt-2 w-full rounded-lg bg-[var(--color-accent)] px-2 py-2 text-[14px] font-semibold text-white"
      >
        =
      </button>
    </div>
  );
}
