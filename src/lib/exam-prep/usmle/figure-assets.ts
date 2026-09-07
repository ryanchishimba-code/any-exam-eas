/**
 * USMLE figure asset catalog — educational SVG templates we own and can serve as approved.
 * World-class bar: clean board-style exhibits, provenance, reviewStatus=approved only at serve.
 */
import {
  attachFigureRefToNgn as attachSharedFigureRef,
  type ExhibitFigureKind,
  type ExhibitFigureRef,
} from "../exhibit-figure";
import {
  CXR_SCHEMATIC_PTX,
  ECG_AFIB,
  ECG_ANTERIOR_STEMI,
  ECG_SINUS,
  PATHWAY_ACS,
} from "./figure-svgs";

export type UsmleFigureKind = ExhibitFigureKind;
export type UsmleFigureRef = ExhibitFigureRef;

export const USMLE_FIGURE_CATALOG: UsmleFigureRef[] = [
  {
    id: "ecg-anterior-stemi-schematic",
    kind: "ecg",
    url: ECG_ANTERIOR_STEMI,
    alt: "Schematic ECG with ST elevation in anterior leads V2–V4",
    caption: "Anterior STEMI — ST elevation in V2–V4",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Board-style schematic — not a real patient tracing",
    organSystem: "cardiovascular",
    topics: ["acs-management", "stemi", "acute-coronary-syndrome", "ecg-interpretation"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "ecg-nsr-schematic",
    kind: "ecg",
    url: ECG_SINUS,
    alt: "Schematic ECG showing normal sinus rhythm with labeled P QRS and T waves",
    caption: "Normal sinus rhythm — P before every QRS",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching strip for comparison cases",
    organSystem: "cardiovascular",
    topics: ["ecg-interpretation", "arrhythmias"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "ecg-afib-schematic",
    kind: "ecg",
    url: ECG_AFIB,
    alt: "Schematic ECG showing atrial fibrillation with irregular RR intervals",
    caption: "AFib — irregularly irregular, no P waves",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching strip — not a patient tracing",
    organSystem: "cardiovascular",
    topics: ["atrial-fibrillation", "arrhythmias", "ecg-interpretation"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "pathway-acs-initial",
    kind: "pathway",
    url: PATHWAY_ACS,
    alt: "Flow diagram for initial ACS management splitting STEMI versus NSTE-ACS",
    caption: "ACS pathway — STEMI vs NSTE-ACS branch",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "High-yield next-step map for Step 2/3",
    organSystem: "cardiovascular",
    topics: ["acs-management", "stemi", "acute-coronary-syndrome"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
  {
    id: "cxr-ptx-schematic",
    kind: "cxr",
    url: CXR_SCHEMATIC_PTX,
    alt: "Schematic chest radiograph of right pneumothorax with visceral pleural line",
    caption: "Right PTX — pleural line + absent markings",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Labeled teaching diagram — not a patient radiograph",
    organSystem: "respiratory-renal",
    topics: ["pneumothorax", "pulmonary", "thoracic-trauma"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-07",
  },
];

const BY_ID = new Map(USMLE_FIGURE_CATALOG.map((f) => [f.id, f]));

/**
 * Purpose keywords — attach only when the item tests the exhibit's teaching cue
 * (not ambient chest pain / ACS workup without ECG pattern language).
 */
export const USMLE_FIGURE_CONTENT_KEYWORDS: Record<string, string[]> = {
  "ecg-anterior-stemi-schematic": [
    "stemi",
    "st elevation",
    "st-segment elevation",
    "st segment elevation",
    "anterior mi",
    "anterior stemi",
    "leads v2",
    "v2-v4",
    "v2–v4",
  ],
  "ecg-nsr-schematic": ["normal sinus", "sinus rhythm", "nsr"],
  "ecg-afib-schematic": [
    "atrial fibrillation",
    "a-fib",
    "afib",
    "a fib",
    "irregularly irregular",
  ],
  "pathway-acs-initial": [
    "stemi",
    "nste-acs",
    "nstemi",
    "acute coronary syndrome",
    "reperfusion",
    "door-to-balloon",
    "emergent pci",
    "primary pci",
  ],
  "cxr-ptx-schematic": [
    "pneumothorax",
    "pleural line",
    "tracheal deviation",
    "tension pneumo",
  ],
};

export function getApprovedFigureById(id: string): UsmleFigureRef | undefined {
  const fig = BY_ID.get(id);
  return fig?.reviewStatus === "approved" ? fig : undefined;
}

export function findApprovedFiguresForTopic(
  topic: string | null | undefined,
  organSystem?: string | null
): UsmleFigureRef[] {
  const t = topic?.trim().toLowerCase() ?? "";
  return USMLE_FIGURE_CATALOG.filter((f) => {
    if (f.reviewStatus !== "approved") return false;
    if (!t) return false;
    return f.topics.some((x) => t.includes(x) || x.includes(t) || t.replace(/\s+/g, "-") === x);
  });
}

export function usmleFigureFitsItem(
  figure: UsmleFigureRef,
  item: {
    vignette?: string | null;
    scenario?: string | null;
    question?: string | null;
    blueprintTopic?: string | null;
    tags?: string[] | null;
  }
): boolean {
  const keys = USMLE_FIGURE_CONTENT_KEYWORDS[figure.id] ?? [];
  if (!keys.length) return false;
  const hay = [item.vignette, item.scenario, item.question]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
  return keys.some((k) => hay.includes(k.toLowerCase()));
}

export function selectUsmleFigureForItem(item: {
  vignette?: string | null;
  scenario?: string | null;
  question?: string | null;
  blueprintTopic?: string | null;
  tags?: string[] | null;
  ngnPayload?: Record<string, unknown> | null;
}): UsmleFigureRef | undefined {
  const topic =
    item.blueprintTopic ??
    (typeof item.ngnPayload?.blueprintTopic === "string"
      ? item.ngnPayload.blueprintTopic
      : null);
  const byTopic = findApprovedFiguresForTopic(topic);
  const pool = byTopic.length ? byTopic : USMLE_FIGURE_CATALOG.filter((f) => f.reviewStatus === "approved");
  return pool.find((f) => usmleFigureFitsItem(f, item));
}

/** Attach first matching approved figure into ngnPayload.media (idempotent by id). */
export function attachFigureRefToNgn(
  ngn: Record<string, unknown>,
  figure: UsmleFigureRef
): Record<string, unknown> {
  const next = attachSharedFigureRef(ngn, figure);
  return {
    ...next,
    kind: next.kind ?? "exhibit",
  };
}
