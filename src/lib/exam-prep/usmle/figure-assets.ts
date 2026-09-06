/**
 * USMLE figure asset catalog — educational SVG templates we own and can serve as approved.
 * World-class bar: clean board-style exhibits, provenance, reviewStatus=approved only at serve.
 *
 * Pixel photography (CXR/histo) attaches the same shape once licensed assets land in Blob/CDN.
 */

export type UsmleFigureKind =
  | "ecg"
  | "cxr"
  | "histo"
  | "gross"
  | "pathway"
  | "lab_panel"
  | "diagram";

export type UsmleFigureRef = {
  id: string;
  kind: UsmleFigureKind;
  /** data: SVG or https CDN URL */
  url: string;
  alt: string;
  caption?: string;
  license: string;
  sourceNote: string;
  organSystem: string;
  topics: string[];
  reviewStatus: "draft" | "approved" | "rejected";
  reviewedAt?: string;
};

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

/** Clean teaching ECG strip — anterior STEMI schematic (not a real tracing). */
const ECG_ANTERIOR_STEMI = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" role="img" aria-label="Schematic ECG showing ST elevation in anterior leads">
  <rect width="640" height="200" fill="#fafafa"/>
  <g stroke="#e2e8f0" stroke-width="1">
    ${Array.from({ length: 33 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="200"/>`).join("")}
    ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="640" y2="${i * 20}"/>`).join("")}
  </g>
  <text x="16" y="24" font-family="ui-sans-serif,system-ui" font-size="13" font-weight="600" fill="#0f172a">Lead V2–V4 (schematic)</text>
  <text x="16" y="42" font-family="ui-sans-serif,system-ui" font-size="11" fill="#64748b">ST elevation · teaching diagram — not a patient tracing</text>
  <path d="M20 120 L60 120 L70 90 L80 150 L95 40 L110 120 L180 120 L190 95 L200 145 L215 50 L230 120 L300 120 L310 90 L320 150 L335 35 L350 120 L420 120 L430 95 L440 145 L455 45 L470 120 L540 120 L550 100 L560 140 L575 55 L590 120 L620 120"
    fill="none" stroke="#0f172a" stroke-width="2.25" stroke-linejoin="round"/>
  <path d="M95 70 L95 40 M215 80 L215 50 M335 65 L335 35 M455 75 L455 45 M575 85 L575 55"
    stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
  <text x="500" y="188" font-family="ui-sans-serif,system-ui" font-size="10" fill="#94a3b8">AnyExamEasy · educational use</text>
</svg>
`);

const ECG_SINUS = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" role="img" aria-label="Schematic normal sinus rhythm ECG">
  <rect width="640" height="200" fill="#fafafa"/>
  <g stroke="#e2e8f0" stroke-width="1">
    ${Array.from({ length: 33 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="200"/>`).join("")}
    ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="640" y2="${i * 20}"/>`).join("")}
  </g>
  <text x="16" y="24" font-family="ui-sans-serif,system-ui" font-size="13" font-weight="600" fill="#0f172a">Lead II (schematic)</text>
  <text x="16" y="42" font-family="ui-sans-serif,system-ui" font-size="11" fill="#64748b">Normal sinus rhythm · teaching diagram</text>
  <path d="M20 120 L50 120 L58 108 L70 120 L78 70 L88 150 L98 120 L160 120 L168 108 L180 120 L188 70 L198 150 L208 120 L270 120 L278 108 L290 120 L298 70 L308 150 L318 120 L380 120 L388 108 L400 120 L408 70 L418 150 L428 120 L490 120 L498 108 L510 120 L518 70 L528 150 L538 120 L600 120"
    fill="none" stroke="#0f172a" stroke-width="2.25" stroke-linejoin="round"/>
  <text x="500" y="188" font-family="ui-sans-serif,system-ui" font-size="10" fill="#94a3b8">AnyExamEasy · educational use</text>
</svg>
`);

const ECG_AFIB = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" role="img" aria-label="Schematic atrial fibrillation ECG">
  <rect width="640" height="200" fill="#fafafa"/>
  <g stroke="#e2e8f0" stroke-width="1">
    ${Array.from({ length: 33 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="200"/>`).join("")}
    ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="640" y2="${i * 20}"/>`).join("")}
  </g>
  <text x="16" y="24" font-family="ui-sans-serif,system-ui" font-size="13" font-weight="600" fill="#0f172a">Lead V1 (schematic)</text>
  <text x="16" y="42" font-family="ui-sans-serif,system-ui" font-size="11" fill="#64748b">Atrial fibrillation — irregular RR, no discrete P waves</text>
  <path d="M20 118 Q30 112 40 118 Q50 124 60 118 Q70 112 80 118 L88 70 L96 150 L104 120 Q120 114 135 120 L145 75 L155 145 L165 120 Q185 125 205 118 L218 70 L228 155 L240 120 Q265 112 290 120 L305 68 L318 152 L330 120 Q360 128 390 118 L405 72 L418 148 L432 120 Q470 110 510 120 L525 70 L538 150 L552 120 Q580 125 620 118"
    fill="none" stroke="#0f172a" stroke-width="2.1" stroke-linejoin="round"/>
  <text x="500" y="188" font-family="ui-sans-serif,system-ui" font-size="10" fill="#94a3b8">AnyExamEasy · educational use</text>
</svg>
`);

const PATHWAY_ACS = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="ACS next-step pathway diagram">
  <rect width="640" height="280" fill="#f8fafc"/>
  <text x="24" y="28" font-family="ui-sans-serif,system-ui" font-size="14" font-weight="700" fill="#0f172a">ACS — initial pathway (schematic)</text>
  <rect x="24" y="48" width="160" height="52" rx="10" fill="#fff" stroke="#cbd5e1"/>
  <text x="104" y="78" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" fill="#0f172a">Chest pain + ECG</text>
  <path d="M184 74 H230" stroke="#64748b" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="230" y="48" width="160" height="52" rx="10" fill="#fff" stroke="#cbd5e1"/>
  <text x="310" y="78" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" fill="#0f172a">STEMI?</text>
  <path d="M390 74 H436" stroke="#64748b" stroke-width="2"/>
  <rect x="436" y="24" width="180" height="44" rx="10" fill="#fef2f2" stroke="#fecaca"/>
  <text x="526" y="50" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" fill="#991b1b">Yes → PCI / reperfusion</text>
  <rect x="436" y="84" width="180" height="44" rx="10" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="526" y="110" text-anchor="middle" font-size="12" font-family="ui-sans-serif,system-ui" fill="#1e40af">No → ASA + risk stratify</text>
  <rect x="24" y="160" width="280" height="72" rx="10" fill="#fff" stroke="#cbd5e1"/>
  <text x="40" y="188" font-size="12" font-family="ui-sans-serif,system-ui" fill="#0f172a">Always: chewable aspirin 162–325 mg</text>
  <text x="40" y="210" font-size="11" font-family="ui-sans-serif,system-ui" fill="#64748b">Teaching pathway — not a full guideline substitute</text>
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/>
    </marker>
  </defs>
</svg>
`);

const CXR_SCHEMATIC_PTX = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img" aria-label="Schematic chest radiograph showing right pneumothorax">
  <rect width="480" height="360" fill="#0b1220"/>
  <text x="16" y="28" font-family="ui-sans-serif,system-ui" font-size="13" font-weight="600" fill="#e2e8f0">CXR schematic — right pneumothorax</text>
  <text x="16" y="48" font-family="ui-sans-serif,system-ui" font-size="11" fill="#94a3b8">Visceral pleural line · no lung markings peripheral — teaching diagram</text>
  <ellipse cx="240" cy="200" rx="150" ry="110" fill="none" stroke="#64748b" stroke-width="3"/>
  <path d="M240 90 Q320 200 240 310 Q160 200 240 90" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <path d="M300 110 L380 110 L380 290 L300 290" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="6 4"/>
  <text x="310" y="200" font-family="ui-sans-serif,system-ui" font-size="12" fill="#fca5a5">Air</text>
  <text x="16" y="340" font-family="ui-sans-serif,system-ui" font-size="10" fill="#64748b">AnyExamEasy · educational schematic (not a patient radiograph)</text>
</svg>
`);

/** Approved educational figure catalog (SVG schematics we own). */
export const USMLE_FIGURE_CATALOG: UsmleFigureRef[] = [
  {
    id: "ecg-anterior-stemi-schematic",
    kind: "ecg",
    url: ECG_ANTERIOR_STEMI,
    alt: "Schematic ECG with ST elevation in anterior leads V2–V4",
    caption: "Anterior STEMI pattern (schematic teaching strip)",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Board-style schematic — not a real patient tracing",
    organSystem: "cardiovascular",
    topics: ["acs-management", "stemi", "acute-coronary-syndrome", "ecg-interpretation"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-06",
  },
  {
    id: "ecg-nsr-schematic",
    kind: "ecg",
    url: ECG_SINUS,
    alt: "Schematic ECG showing normal sinus rhythm",
    caption: "Normal sinus rhythm (schematic)",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching strip for comparison cases",
    organSystem: "cardiovascular",
    topics: ["ecg-interpretation", "arrhythmias"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-06",
  },
  {
    id: "ecg-afib-schematic",
    kind: "ecg",
    url: ECG_AFIB,
    alt: "Schematic ECG showing atrial fibrillation",
    caption: "Atrial fibrillation — irregularly irregular (schematic)",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Teaching strip — not a patient tracing",
    organSystem: "cardiovascular",
    topics: ["atrial-fibrillation", "arrhythmias", "ecg-interpretation"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-06",
  },
  {
    id: "pathway-acs-initial",
    kind: "pathway",
    url: PATHWAY_ACS,
    alt: "Flow diagram for initial ACS management",
    caption: "ACS initial pathway (schematic)",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "High-yield next-step map for Step 2/3",
    organSystem: "cardiovascular",
    topics: ["acs-management", "stemi", "acute-coronary-syndrome"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-06",
  },
  {
    id: "cxr-ptx-schematic",
    kind: "cxr",
    url: CXR_SCHEMATIC_PTX,
    alt: "Schematic chest radiograph of right pneumothorax",
    caption: "Right pneumothorax — pleural line schematic",
    license: "AnyExamEasy original educational SVG",
    sourceNote: "Labeled teaching diagram — not a patient radiograph",
    organSystem: "respiratory-renal",
    topics: ["pneumothorax", "pulmonary", "thoracic-trauma"],
    reviewStatus: "approved",
    reviewedAt: "2026-09-06",
  },
];

const BY_ID = new Map(USMLE_FIGURE_CATALOG.map((f) => [f.id, f]));

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
    if (organSystem && f.organSystem === organSystem) {
      if (!t) return true;
    }
    if (!t) return false;
    return f.topics.some((x) => t.includes(x) || x.includes(t) || t.replace(/\s+/g, "-") === x);
  });
}

/** Attach first matching approved figure into ngnPayload.media (idempotent by id). */
export function attachFigureRefToNgn(
  ngn: Record<string, unknown>,
  figure: UsmleFigureRef
): Record<string, unknown> {
  const media = Array.isArray(ngn.media) ? [...(ngn.media as UsmleFigureRef[])] : [];
  if (media.some((m) => m.id === figure.id)) return ngn;
  media.push(figure);
  return {
    ...ngn,
    media,
    kind: ngn.kind ?? "exhibit",
  };
}
