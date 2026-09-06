/**
 * Derive structured lab/vital tables from vignette text — no AI required.
 */
import type { BankItem } from "@/lib/question-bank";
import type { LabTableRow, LabTableVisual, VisualRationaleBlock } from "./visual-rationale-types";

const LAB_PATTERNS: Array<{
  re: RegExp;
  label: string;
  reference?: string;
  abnormal?: (match: RegExpMatchArray) => boolean;
}> = [
  {
    re: /\b(?:BP|blood pressure)\s*(?:is|:)?\s*(\d{2,3}\s*\/\s*\d{2,3})\b/i,
    label: "Blood pressure",
    reference: "90–120 / 60–80 mmHg",
    abnormal: (m) => {
      const [sys, dia] = m[1]!.split("/").map((n) => parseInt(n.trim(), 10));
      return sys < 90 || sys > 140 || dia < 60 || dia > 90;
    },
  },
  {
    re: /\b(?:HR|heart rate|pulse)\s*(?:is|:)?\s*(\d{2,3})\s*(?:bpm)?\b/i,
    label: "Heart rate",
    reference: "60–100 bpm",
    abnormal: (m) => {
      const hr = parseInt(m[1]!, 10);
      return hr < 60 || hr > 100;
    },
  },
  {
    re: /\b(?:RR|respiratory rate)\s*(?:is|:)?\s*(\d{1,2})\s*(?:\/\s*min|breaths)?\b/i,
    label: "Respiratory rate",
    reference: "12–20 /min",
    abnormal: (m) => {
      const rr = parseInt(m[1]!, 10);
      return rr < 12 || rr > 20;
    },
  },
  {
    re: /\b(?:Temp(?:erature)?|T)\s*(?:is|:)?\s*(\d{2,3}(?:\.\d)?)\s*°?\s*F\b/i,
    label: "Temperature",
    reference: "97.8–99.1 °F",
    abnormal: (m) => {
      const t = parseFloat(m[1]!);
      return t >= 100.4 || t < 96.8;
    },
  },
  {
    re: /SpO2?\s*(?:is|:)?\s*(\d{2,3})\s*%/i,
    label: "SpO₂",
    reference: "≥ 95% on room air",
    abnormal: (m) => parseInt(m[1]!, 10) < 95,
  },
  {
    re: /\b(?:WBC|white blood cell count)\s*(?:is|:)?\s*([\d,]+)\s*(?:\/\s*mm³|\/mm3)?\b/i,
    label: "WBC",
    reference: "4,500–11,000 /mm³",
    abnormal: (m) => {
      const n = parseInt(m[1]!.replace(/,/g, ""), 10);
      return n < 4500 || n > 11000;
    },
  },
  {
    re: /\b(?:Hgb|hemoglobin)\s*(?:is|:)?\s*([\d.]+)\s*(?:g\/dL|g\/dl)?\b/i,
    label: "Hemoglobin",
    reference: "12–16 g/dL (F)",
    abnormal: (m) => {
      const n = parseFloat(m[1]!);
      return n < 12 || n > 16;
    },
  },
  {
    re: /\b(?:Na\+?|sodium)\s*(?:is|:)?\s*(\d{2,3})\s*(?:mEq\/L|mmol\/L)?\b/i,
    label: "Sodium",
    reference: "136–145 mEq/L",
    abnormal: (m) => {
      const n = parseInt(m[1]!, 10);
      return n < 136 || n > 145;
    },
  },
  {
    re: /\b(?:K\+?|potassium)\s*(?:is|:)?\s*([\d.]+)\s*(?:mEq\/L|mmol\/L)?\b/i,
    label: "Potassium",
    reference: "3.5–5.0 mEq/L",
    abnormal: (m) => {
      const n = parseFloat(m[1]!);
      return n < 3.5 || n > 5.0;
    },
  },
  {
    re: /\b(?:Cr|creatinine)\s*(?:is|:)?\s*([\d.]+)\s*(?:mg\/dL)?\b/i,
    label: "Creatinine",
    reference: "0.6–1.2 mg/dL",
    abnormal: (m) => parseFloat(m[1]!) > 1.2,
  },
  {
    re: /\b(?:BUN)\s*(?:is|:)?\s*([\d.]+)\s*(?:mg\/dL)?\b/i,
    label: "BUN",
    reference: "7–20 mg/dL",
    abnormal: (m) => parseFloat(m[1]!) > 20,
  },
  {
    re: /\b(?:INR)\s*(?:is|:)?\s*([\d.]+)\b/i,
    label: "INR",
    reference: "0.8–1.2 (no anticoagulation)",
    abnormal: (m) => parseFloat(m[1]!) > 1.2,
  },
  {
    re: /\b(?:glucose|blood sugar|BG)\s*(?:is|:)?\s*(\d{2,3})\s*(?:mg\/dL)?\b/i,
    label: "Blood glucose",
    reference: "70–140 mg/dL",
    abnormal: (m) => {
      const n = parseInt(m[1]!, 10);
      return n < 70 || n > 140;
    },
  },
];

function vignetteText(item: BankItem): string {
  return [item.vignette, item.scenario, item.question].filter(Boolean).join("\n");
}

export function extractLabRowsFromText(text: string): LabTableRow[] {
  const rows: LabTableRow[] = [];
  const seen = new Set<string>();

  for (const pattern of LAB_PATTERNS) {
    const match = text.match(pattern.re);
    if (!match) continue;
    if (seen.has(pattern.label)) continue;
    seen.add(pattern.label);

    const value = match[1]!.trim();
    const abnormal = pattern.abnormal?.(match) ?? false;
    rows.push({
      label: pattern.label,
      value: value.includes("/") && pattern.label === "Blood pressure" ? `${value} mmHg` : value,
      reference: pattern.reference,
      abnormal,
    });
  }

  return rows;
}

export function deriveLabTableFromItem(item: BankItem): LabTableVisual | null {
  const text = vignetteText(item);
  const rows = extractLabRowsFromText(text);
  if (rows.length < 2) return null;

  return {
    kind: "lab_table",
    title: rows.some((r) => r.abnormal) ? "Key findings (abnormal values highlighted)" : "Key clinical values",
    rows,
  };
}

function deriveImageBlocksFromMedia(item: BankItem): VisualRationaleBlock[] {
  const media = item.ngnPayload?.media;
  if (!Array.isArray(media)) return [];
  const blocks: VisualRationaleBlock[] = [];
  for (const raw of media) {
    if (!raw || typeof raw !== "object") continue;
    const fig = raw as {
      reviewStatus?: string;
      url?: string;
      alt?: string;
      caption?: string;
      kind?: string;
    };
    if (fig.reviewStatus !== "approved" || !fig.url || !fig.alt) continue;
    blocks.push({
      kind: "image",
      title: fig.caption || fig.kind || "Clinical exhibit",
      url: fig.url,
      alt: fig.alt,
      caption: fig.caption,
    });
  }
  return blocks;
}

export function deriveVisualBlocksFromItem(item: BankItem): VisualRationaleBlock[] {
  const blocks: VisualRationaleBlock[] = [];
  const lab = deriveLabTableFromItem(item);
  if (lab) blocks.push(lab);
  blocks.push(...deriveImageBlocksFromMedia(item));
  return blocks;
}
