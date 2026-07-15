/**
 * Repair AI-generated NCLEX NGN payloads so answer validation can pass.
 * Models often emit correctAnswer + options without structured actions/monitors/rows.
 */
import type { BankItem } from "@/lib/question-bank";
import { cleanOptionText } from "@/lib/question-format";
import { itemTypeToNgnFormat } from "./ngn-bank-bridge";

function norm(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function splitCompositeAnswer(correctAnswer: string): string[] {
  const trimmed = correctAnswer.trim();
  if (!trimmed) return [];
  if (trimmed.includes("|||")) {
    return trimmed
      .split("|||")
      .map((part) => cleanOptionText(part.trim()))
      .filter(Boolean);
  }
  return trimmed
    .split(",")
    .map((part) => cleanOptionText(part.trim()))
    .filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const key = norm(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value.trim());
  }
  return out;
}

function ensureInList(list: string[], value: string): string[] {
  if (list.some((entry) => norm(entry) === norm(value))) return list;
  return [value, ...list];
}

/** Build a structurally valid ngnPayload for generated (or thin) NGN items. */
export function repairGeneratedNclexNgnItem(item: BankItem): BankItem {
  const itemType = (item.itemType ?? "vignette").trim();
  const options = (item.options ?? []).map((o) => String(o).trim()).filter(Boolean);
  const correctAnswer = item.correctAnswer?.trim() ?? "";
  const existing =
    item.ngnPayload && typeof item.ngnPayload === "object"
      ? { ...(item.ngnPayload as Record<string, unknown>) }
      : {};

  const kindFromType = itemTypeToNgnFormat(itemType);
  const kind = String(existing.kind ?? kindFromType ?? itemType);

  // Unfolding case steps are single-best-answer MCQs — don't force structured NGN answers.
  if (itemType === "case_study" || itemType === "unfolding_case") {
    return {
      ...item,
      options,
      ngnPayload: {
        ...existing,
        kind: "mcq",
        caseGroupId: existing.caseGroupId,
        caseStep: existing.caseStep,
        options,
      },
    };
  }

  if (itemType === "select_all" || itemType === "sata" || kind === "select_all") {
    let sataAnswer = correctAnswer;
    const parts = splitCompositeAnswer(correctAnswer);
    const matched = parts
      .map(
        (part) =>
          options.find((option) => norm(option) === norm(part)) ??
          options.find(
            (option) => norm(option).includes(norm(part)) || norm(part).includes(norm(option))
          )
      )
      .filter((part): part is string => Boolean(part));
    if (matched.length >= 1) {
      sataAnswer = uniqueStrings(matched).join(",");
    } else if (options.length >= 2) {
      // Single wrong stem → keep first two options as a salvage SATA key.
      sataAnswer = options.slice(0, 2).join(",");
    }
    return {
      ...item,
      itemType: "select_all",
      options,
      correctAnswer: sataAnswer,
      ngnPayload: {
        ...existing,
        kind: "select_all",
        options: Array.isArray(existing.options) && existing.options.length >= 3
          ? existing.options
          : options,
      },
    };
  }

  if (itemType === "ordered_response" || kind === "ordered_response" || kind === "drag_drop") {
    let orderedAnswer = correctAnswer;
    let parts = splitCompositeAnswer(correctAnswer);
    // Map "A,B,C" or "1,2,3" letter/number sequences onto option text.
    if (
      parts.length >= 2 &&
      parts.every((part) => /^[A-Da-d1-9]$/.test(part.trim())) &&
      options.length >= parts.length
    ) {
      orderedAnswer = parts
        .map((part) => {
          const token = part.trim().toUpperCase();
          if (/^[A-D]$/.test(token)) {
            return options[token.charCodeAt(0) - 65] ?? part;
          }
          const idx = Number(token) - 1;
          return options[idx] ?? part;
        })
        .join(",");
      parts = splitCompositeAnswer(orderedAnswer);
    }
    // Fuzzy match parts → options; else fall back to option order (always valid).
    const matched = parts
      .map(
        (part) =>
          options.find((option) => norm(option) === norm(part)) ??
          options.find(
            (option) => norm(option).includes(norm(part)) || norm(part).includes(norm(option))
          )
      )
      .filter((part): part is string => Boolean(part));
    if (matched.length >= 2) {
      orderedAnswer = uniqueStrings(matched).join(",");
    } else if (options.length >= 3) {
      orderedAnswer = options.slice(0, Math.min(4, options.length)).join(",");
    }
    return {
      ...item,
      itemType: "ordered_response",
      options,
      correctAnswer: orderedAnswer,
      ngnPayload: {
        ...existing,
        kind: "ordered_response",
        options: Array.isArray(existing.options) && existing.options.length >= 3
          ? existing.options
          : options,
      },
    };
  }

  if (itemType === "ngn_highlight" || kind === "highlight") {
    const parts = splitCompositeAnswer(correctAnswer);
    const highlights =
      Array.isArray(existing.highlights) && existing.highlights.length > 0
        ? existing.highlights.map(String)
        : uniqueStrings([...parts, ...options]);
    return {
      ...item,
      itemType: "ngn_highlight",
      options: options.length >= 2 ? options : highlights,
      ngnPayload: {
        ...existing,
        kind: "highlight",
        highlights,
        text: typeof existing.text === "string" ? existing.text : item.vignette ?? "",
      },
    };
  }

  if (itemType === "ngn_bowtie" || kind === "bow_tie") {
    let parts = splitCompositeAnswer(correctAnswer);
    let actions = Array.isArray(existing.actions) ? existing.actions.map(String) : [];
    let monitors = Array.isArray(existing.monitors) ? existing.monitors.map(String) : [];

    // Models often return a single best-answer string — synthesize a bow-tie from options.
    if (parts.length < 3 && options.length >= 4) {
      const action = parts[0] && options.some((o) => norm(o) === norm(parts[0]!))
        ? parts[0]!
        : options[0]!;
      const pool = options.filter((option) => norm(option) !== norm(action));
      const monitorA = parts[1] && pool.some((o) => norm(o) === norm(parts[1]!)) ? parts[1]! : pool[0]!;
      const monitorB =
        parts[2] && pool.some((o) => norm(o) === norm(parts[2]!))
          ? parts[2]!
          : pool.find((o) => norm(o) !== norm(monitorA)) ?? pool[1] ?? pool[0]!;
      parts = [action, monitorA, monitorB].filter(Boolean);
      // Pad action/monitor pools so bow-tie validators have enough choices.
      if (actions.length === 0) {
        actions = uniqueStrings([action, ...pool]).slice(0, 4);
      }
      if (monitors.length === 0) {
        monitors = uniqueStrings([monitorA, monitorB, ...pool.filter((o) => norm(o) !== norm(monitorA))]).slice(
          0,
          4
        );
      }
    }

    if ((actions.length === 0 || monitors.length === 0) && options.length >= 4 && parts.length >= 3) {
      const action = parts[0]!;
      const pickedMonitors = parts.slice(1);
      const remaining = options.filter(
        (option) => !parts.some((part) => norm(part) === norm(option))
      );
      const mid = Math.ceil(remaining.length / 2);
      actions = uniqueStrings([action, ...remaining.slice(0, Math.max(mid, 1))]).slice(0, 4);
      monitors = uniqueStrings([...pickedMonitors, ...remaining.slice(mid)]).slice(0, 4);
      while (actions.length < 3 && remaining.length) {
        actions = ensureInList(actions, remaining[actions.length % remaining.length]!);
      }
      while (monitors.length < 3 && remaining.length) {
        monitors = ensureInList(monitors, remaining[(monitors.length + 1) % remaining.length]!);
      }
    } else {
      if (parts[0]) actions = ensureInList(actions, parts[0]);
      for (const monitor of parts.slice(1)) monitors = ensureInList(monitors, monitor);
      // Ensure lists are large enough for a real bow-tie UI.
      for (const option of options) {
        if (actions.length < 4 && !monitors.some((m) => norm(m) === norm(option))) {
          actions = ensureInList(actions, option);
        } else if (monitors.length < 4 && !actions.some((a) => norm(a) === norm(option))) {
          monitors = ensureInList(monitors, option);
        }
      }
    }

    const combined = uniqueStrings([...actions, ...monitors]);
    return {
      ...item,
      itemType: "ngn_bowtie",
      options: combined.length >= 4 ? combined : options,
      correctAnswer: parts.length >= 3 ? parts.join(",") : correctAnswer,
      ngnPayload: {
        ...existing,
        kind: "bow_tie",
        actions,
        monitors,
        monitorPickCount:
          typeof existing.monitorPickCount === "number"
            ? existing.monitorPickCount
            : Math.max(2, parts.length - 1),
        condition: existing.condition ?? item.question,
      },
    };
  }

  if (itemType === "ngn_matrix" || kind === "matrix") {
    let rows = Array.isArray(existing.rows) ? existing.rows.map(String) : [];
    let columns = Array.isArray(existing.columns) ? existing.columns.map(String) : [];
    const pairOptions = options.filter((option) => option.includes("|||"));
    let answerPairs = correctAnswer
      .split(/,(?=[^,]+\|\|\|)/)
      .map((part) => part.trim())
      .filter((part) => part.includes("|||"));

    // Sync grid from any available row|||column pairs (model answer or option cells).
    const seedPairs = [...answerPairs, ...pairOptions];
    if (seedPairs.length > 0) {
      rows = uniqueStrings([
        ...rows,
        ...seedPairs.map((pair) => pair.split("|||")[0]!.trim()),
      ]);
      columns = uniqueStrings([
        ...columns,
        ...seedPairs.map((pair) => pair.split("|||")[1]?.trim() ?? ""),
      ]);
    }

    // Flat options → classic Indicated / Not indicated matrix.
    if ((rows.length === 0 || columns.length === 0) && options.length >= 4) {
      const selected = splitCompositeAnswer(correctAnswer).filter((part) =>
        options.some((option) => norm(option) === norm(part) && !part.includes("|||"))
      );
      rows = uniqueStrings(options.filter((o) => !o.includes("|||"))).slice(0, 4);
      columns = ["Indicated", "Not indicated"];
      const indicated = (selected.length >= 1 ? selected : rows.slice(0, 2)).filter((row) =>
        rows.some((candidate) => norm(candidate) === norm(row))
      );
      answerPairs = indicated.map((row) => `${row}|||Indicated`);
    }

    if (columns.length === 0) columns = ["Indicated", "Not indicated"];
    if (rows.length === 0 && options.length >= 2) {
      rows = uniqueStrings(options.map((o) => o.split("|||")[0]!.trim())).slice(0, 4);
    }

    // Validators require ≥2 answer pairs — pad with a Not-indicated / second-column cell.
    if (answerPairs.length === 1 && rows.length >= 2) {
      const usedRow = answerPairs[0]!.split("|||")[0]!.trim();
      const usedCol = answerPairs[0]!.split("|||")[1]?.trim() ?? columns[0]!;
      const otherRow = rows.find((row) => norm(row) !== norm(usedRow)) ?? rows[1]!;
      const padCol =
        columns.find((column) => norm(column) !== norm(usedCol)) ?? columns[columns.length - 1]!;
      answerPairs = [...answerPairs, `${otherRow}|||${padCol}`];
    }
    if (answerPairs.length === 0 && rows.length >= 2 && columns.length >= 1) {
      answerPairs = [`${rows[0]}|||${columns[0]}`, `${rows[1]}|||${columns[0]}`];
    }

    return {
      ...item,
      itemType: "ngn_matrix",
      options: rows.flatMap((row) => columns.map((column) => `${row}|||${column}`)),
      correctAnswer: answerPairs.join(","),
      ngnPayload: { ...existing, kind: "matrix", rows, columns },
    };
  }

  return {
    ...item,
    options,
    ngnPayload: { ...existing, kind, options: existing.options ?? options },
  };
}
