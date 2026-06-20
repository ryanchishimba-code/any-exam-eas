"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  Lock,
  Minus,
  MousePointer2,
  Scan,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";

// ── Constants ────────────────────────────────────────────────────────────────

/**
 * Number of tab/structure interactions before the trial gate appears.
 * The first view is free — count starts at 0, gate triggers when count hits LIMIT.
 */
const INTERACTION_LIMIT = 3;

// ── Data ─────────────────────────────────────────────────────────────────────

type StructurePreview = {
  id: string;
  name: string;
  pearl: string;
  pearHigh: string;
  procedures: string[];
  drugs: string[];
  questions: number;
};

type SystemData = {
  id: string;
  label: string;
  color: string;
  structures: StructurePreview[];
};

const SYSTEMS: SystemData[] = [
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    color: "#ef4444",
    structures: [
      {
        id: "heart",
        name: "Heart",
        pearHigh: "LAD occlusion → anterior MI (V1–V4)",
        pearl:
          "LAD occlusion → anterior MI (V1–V4). RCA → inferior MI (II, III, aVF). RCA also supplies the SA & AV nodes — expect bradycardia with inferior MI.",
        procedures: ["Cardiac catheterization", "Pericardiocentesis", "CABG"],
        drugs: ["β-blockers", "Statins", "ACE inhibitors"],
        questions: 210,
      },
      {
        id: "aorta",
        name: "Aorta",
        pearHigh: "Type A dissection → surgical emergency",
        pearl:
          "Type A dissection involves the ascending aorta → surgical emergency. Type B (descending only) → medical management. Marfan and hypertension are top risk factors.",
        procedures: ["Aortic valve replacement", "Endovascular stent graft"],
        drugs: ["Nitroprusside", "Esmolol", "Labetalol"],
        questions: 87,
      },
      {
        id: "carotid-artery",
        name: "Carotid Artery",
        pearHigh: "Carotid bruit + TIA → duplex ultrasound first",
        pearl:
          "Carotid bruit + TIA → duplex ultrasound first. >70% stenosis → carotid endarterectomy. Amaurosis fugax = ipsilateral carotid stenosis until proven otherwise.",
        procedures: ["Carotid endarterectomy", "Carotid stenting"],
        drugs: ["Aspirin", "Clopidogrel", "High-intensity statins"],
        questions: 64,
      },
    ],
  },
  {
    id: "nervous",
    label: "Nervous System",
    color: "#8b5cf6",
    structures: [
      {
        id: "brain",
        name: "Brain",
        pearHigh: "Broca's = expressive aphasia; Wernicke's = receptive aphasia",
        pearl:
          "Broca's = expressive aphasia (L inferior frontal). Wernicke's = receptive aphasia (L superior temporal). MCA stroke → contralateral face + arm > leg weakness.",
        procedures: ["Lumbar puncture", "Craniotomy", "VP shunt"],
        drugs: ["tPA", "Mannitol", "Nimodipine"],
        questions: 195,
      },
      {
        id: "spinal-cord",
        name: "Spinal Cord",
        pearHigh: "Brown-Séquard: ipsilateral motor + contralateral pain/temp loss",
        pearl:
          "Brown-Séquard (hemisection): ipsilateral motor loss + contralateral pain/temp loss. Central cord syndrome (most common) → greater weakness in arms than legs.",
        procedures: ["Epidural steroid injection", "Discectomy"],
        drugs: ["Methylprednisolone", "Baclofen", "Gabapentin"],
        questions: 118,
      },
    ],
  },
  {
    id: "respiratory",
    label: "Respiratory",
    color: "#0ea5e9",
    structures: [
      {
        id: "lungs",
        name: "Lungs",
        pearHigh: "Right main bronchus more vertical → aspirated objects → RLL",
        pearl:
          "Right main bronchus more vertical → aspirated objects land in right lower lobe. Upper lobe = TB (apical). Lower lobe = aspiration pneumonia (supine patient).",
        procedures: ["Bronchoscopy", "Chest tube", "Needle decompression"],
        drugs: ["β₂-agonists", "Inhaled corticosteroids", "Azithromycin"],
        questions: 178,
      },
      {
        id: "trachea",
        name: "Trachea",
        pearHigh: "Tracheal deviation away from tension pneumothorax",
        pearl:
          "Tracheal deviation away from tension pneumothorax — needle decompression at 2nd ICS MCL, then chest tube. Mediastinal shift toward effusion or atelectasis.",
        procedures: ["Tracheostomy", "Cricothyrotomy"],
        drugs: ["Heliox", "Racemic epinephrine"],
        questions: 52,
      },
    ],
  },
  {
    id: "digestive",
    label: "Digestive",
    color: "#f59e0b",
    structures: [
      {
        id: "liver",
        name: "Liver",
        pearHigh: "Zone 3 = alcohol + acetaminophen + CCF (centrilobular necrosis)",
        pearl:
          "Zone 1 (periportal) = ischemia, aflatoxin. Zone 3 (centrilobular) = alcohol, acetaminophen, CCF. Child-Pugh: bilirubin, albumin, PT, ascites, encephalopathy.",
        procedures: ["Liver biopsy", "TIPS", "Paracentesis"],
        drugs: ["Rifaximin", "Lactulose", "Propranolol (varices)"],
        questions: 143,
      },
      {
        id: "pancreas",
        name: "Pancreas",
        pearHigh: "Gallstones + alcohol = 80% of acute pancreatitis cases",
        pearl:
          "Gallstones + alcohol = 80% of acute pancreatitis. Ranson criteria (admission: glucose >200, WBC >16K, age >55). Cullen's sign = periumbilical bruising.",
        procedures: ["ERCP", "Whipple procedure"],
        drugs: ["Octreotide", "Proton pump inhibitors"],
        questions: 96,
      },
    ],
  },
  {
    id: "skeletal",
    label: "Musculoskeletal",
    color: "#6b7280",
    structures: [
      {
        id: "femur",
        name: "Femur",
        pearHigh: "Subcapital fracture → AVN of femoral head",
        pearl:
          "Subcapital fracture disrupts medial circumflex femoral artery → AVN. Garden IV (complete displacement) → highest AVN risk. Fat emboli risk after long-bone fracture.",
        procedures: ["Total hip replacement", "ORIF", "Hip pinning"],
        drugs: ["Bisphosphonates", "Teriparatide", "Calcium + Vitamin D"],
        questions: 88,
      },
    ],
  },
  {
    id: "endocrine",
    label: "Endocrine",
    color: "#10b981",
    structures: [
      {
        id: "thyroid",
        name: "Thyroid",
        pearHigh: "Papillary cancer = most common; psammoma bodies, RET mutation",
        pearl:
          "Papillary (80%) — psammoma bodies, 'Orphan Annie' nuclei, RET mutation, best prognosis. Medullary cancer → calcitonin marker, associated with MEN 2A/2B.",
        procedures: ["FNA biopsy", "Thyroidectomy", "Radioiodine ablation"],
        drugs: ["Levothyroxine", "Methimazole", "Propylthiouracil"],
        questions: 104,
      },
    ],
  },
  {
    id: "urinary",
    label: "Urinary",
    color: "#3b82f6",
    structures: [
      {
        id: "kidneys",
        name: "Kidneys",
        pearHigh: "Ureteral stones lodge at 3 narrow points — UPJ, pelvic brim, UVJ",
        pearl:
          "Ureteral stones lodge at ureteropelvic junction, pelvic brim, or ureterovesical junction. ACE inhibitors slow CKD progression regardless of etiology.",
        procedures: ["Renal biopsy", "Nephrostomy", "Ureteroscopy"],
        drugs: ["ACE inhibitors", "Allopurinol (uric acid stones)", "Thiazides (calcium stones)"],
        questions: 131,
      },
    ],
  },
];

// ── Feature modes ─────────────────────────────────────────────────────────────

const MODES = [
  {
    icon: MousePointer2,
    label: "3D Atlas",
    detail: "Rotate, zoom & click any organ, vessel, or bone in a full 3D viewport",
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/40",
  },
  {
    icon: Scan,
    label: "CT Atlas",
    detail: "Scroll through Hounsfield-window CT slices — soft tissue, bone, lung, angio",
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/40",
  },
  {
    icon: BookOpen,
    label: "Guided Tours",
    detail: "Exam-scoped narrated walkthroughs — heart, stroke, GI, renal, MSK, endocrine",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    icon: Zap,
    label: "Click-Quiz",
    detail: "'Click the structure' board-style identification with 3D highlighting",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
] as const;

// ── Comparison rows ───────────────────────────────────────────────────────────

const COMPARE_ROWS = [
  { feature: "Interactive 3D anatomy viewer", us: true, others: false },
  { feature: "CT Atlas with Hounsfield windows", us: true, others: false },
  { feature: "Guided exam-scoped tours", us: true, others: false },
  { feature: "Click-to-identify quiz mode", us: true, others: false },
  { feature: "Drug + procedure links per structure", us: true, others: false },
  { feature: "Deep-linked from practice questions", us: true, others: "varies" },
] as const;

// ── Trial gate overlay ────────────────────────────────────────────────────────

function TrialGateOverlay({ systemsExplored }: { systemsExplored: number }) {
  const reduceMotion = useReducedMotion();

  const remaining = SYSTEMS.length - systemsExplored;
  const remainingStructures =
    SYSTEMS.slice(systemsExplored).reduce((n, s) => n + s.structures.length, 0);

  return (
    <motion.div
      key="gate"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-b-3xl p-6 text-center"
      style={{
        background:
          "linear-gradient(to bottom, transparent 0%, var(--color-surface-elevated) 18%)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Lock icon */}
      <motion.div
        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-900/20"
      >
        <Lock className="h-7 w-7 text-white" strokeWidth={2} />
      </motion.div>

      {/* Headline */}
      <motion.h3
        initial={reduceMotion ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 text-xl font-bold tracking-tight text-[var(--color-ink)]"
      >
        You&apos;ve seen the preview.
      </motion.h3>

      {/* Subhead */}
      <motion.p
        initial={reduceMotion ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 max-w-xs text-sm text-[var(--color-ink-muted)]"
      >
        {remaining} more body systems and {remainingStructures}+ structures — plus the full
        3D viewer, CT Atlas, and guided tours — are waiting in the app.
      </motion.p>

      {/* What they unlock */}
      <motion.ul
        initial={reduceMotion ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        {[
          "32 structures",
          "9 body systems",
          "CT Atlas",
          "Guided tours",
          "Click-Quiz",
          "Drug links",
        ].map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300"
          >
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            {item}
          </li>
        ))}
      </motion.ul>

      {/* Primary CTA */}
      <motion.div
        initial={reduceMotion ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex flex-col items-center gap-2"
      >
        <Link
          href={LANDING_TRIAL_HREF}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/25 transition hover:shadow-teal-900/40 hover:brightness-105"
        >
          Start free trial — unlock everything
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
        <p className="text-[10px] font-medium text-[var(--color-ink-muted)]">
          14-day free trial · all 6 exams included · cancel before trial ends
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LandingAnatomyPreview() {
  const [activeSystemId, setActiveSystemId] = useState(SYSTEMS[0].id);
  const [activeStructureId, setActiveStructureId] = useState(SYSTEMS[0].structures[0].id);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isGated, setIsGated] = useState(false);
  const [systemsExplored, setSystemsExplored] = useState(1); // starts with cardiovascular
  const [exploredSystemIds, setExploredSystemIds] = useState<Set<string>>(
    new Set([SYSTEMS[0].id])
  );
  const reduceMotion = useReducedMotion();

  const activeSystem = SYSTEMS.find((s) => s.id === activeSystemId) ?? SYSTEMS[0];
  const activeStructure =
    activeSystem.structures.find((s) => s.id === activeStructureId) ??
    activeSystem.structures[0];

  function recordInteraction() {
    if (isGated) return false;
    const next = interactionCount + 1;
    setInteractionCount(next);
    if (next >= INTERACTION_LIMIT) {
      setIsGated(true);
    }
    return true;
  }

  function selectSystem(id: string) {
    if (isGated) return;
    const sys = SYSTEMS.find((s) => s.id === id);
    if (!sys) return;
    setActiveSystemId(id);
    setActiveStructureId(sys.structures[0].id);
    // Only count switching to a NEW system as an interaction
    if (!exploredSystemIds.has(id)) {
      setExploredSystemIds((prev) => new Set([...prev, id]));
      setSystemsExplored((n) => n + 1);
      recordInteraction();
    }
  }

  function selectStructure(id: string) {
    if (isGated) return;
    if (id === activeStructureId) return;
    setActiveStructureId(id);
    recordInteraction();
  }

  const progressPct = Math.min((interactionCount / INTERACTION_LIMIT) * 100, 100);

  return (
    <section
      id="anatomy-studio"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-surface)] py-16 sm:py-20"
      aria-labelledby="anatomy-section-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">

        {/* ── Section header ── */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
            Anatomy Studio
          </p>
          <h2
            id="anatomy-section-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            The 3D anatomy tool no other board prep includes.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
            Rotate real 3D organs, scroll CT slices, follow guided tours, and jump to practice questions — all in one subscription. Browse a preview below.
          </p>
        </div>

        {/* ── Feature modes grid ── */}
        <ul
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          aria-label="Anatomy Studio features"
        >
          {MODES.map(({ icon: Icon, label, detail, color, bg }) => (
            <li key={label} className={`rounded-2xl border border-[var(--color-border)] ${bg} p-4`}>
              <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.75} aria-hidden />
              <p className="mt-3 text-sm font-bold text-[var(--color-ink)]">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">{detail}</p>
            </li>
          ))}
        </ul>

        {/* ── Interactive browser with trial gate ── */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">

          {/* Header bar with progress indicator */}
          <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
            <div
              className="flex gap-1 overflow-x-auto scrollbar-none"
              role="tablist"
              aria-label="Body systems"
            >
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  role="tab"
                  aria-selected={activeSystemId === sys.id}
                  onClick={() => selectSystem(sys.id)}
                  disabled={isGated && !exploredSystemIds.has(sys.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-default ${
                    isGated && !exploredSystemIds.has(sys.id)
                      ? "text-[var(--color-ink-muted)]/30"
                      : activeSystemId === sys.id
                      ? "bg-[var(--color-ink)] text-[var(--color-surface)]"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-ink)]"
                  }`}
                  style={
                    activeSystemId === sys.id && !isGated
                      ? { background: sys.color, color: "#fff" }
                      : {}
                  }
                >
                  {sys.label}
                  {isGated && !exploredSystemIds.has(sys.id) && (
                    <Lock className="ml-1 inline h-2.5 w-2.5 opacity-40" aria-hidden />
                  )}
                </button>
              ))}
            </div>

            {/* Interaction progress hint */}
            {!isGated && (
              <div
                className="hidden shrink-0 items-center gap-2 sm:flex"
                aria-label={`${interactionCount} of ${INTERACTION_LIMIT} free interactions used`}
              >
                <span className="text-[10px] font-semibold text-[var(--color-ink-muted)]">
                  Preview
                </span>
                <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content grid */}
          <div className="relative grid min-h-[380px] gap-0 lg:grid-cols-[220px_1fr]">
            {/* Structure list — dimmed when gated */}
            <ul
              className={`border-b border-[var(--color-border)] py-2 transition-opacity lg:border-b-0 lg:border-r ${
                isGated ? "opacity-30" : ""
              }`}
              role="listbox"
              aria-label="Structures"
            >
              {activeSystem.structures.map((s) => (
                <li key={s.id} role="option" aria-selected={activeStructureId === s.id}>
                  <button
                    onClick={() => selectStructure(s.id)}
                    disabled={isGated}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-default ${
                      activeStructureId === s.id
                        ? "bg-[var(--color-surface)] font-semibold text-[var(--color-ink)]"
                        : "font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <span>{s.name}</span>
                    {activeStructureId === s.id && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: activeSystem.color }}
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Structure detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStructureId}
                initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-5 sm:p-6 ${isGated ? "pointer-events-none select-none blur-[2px]" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `${activeSystem.color}18`,
                      color: activeSystem.color,
                    }}
                    aria-hidden
                  >
                    <Stethoscope className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p
                      className="text-[0.625rem] font-bold uppercase tracking-widest"
                      style={{ color: activeSystem.color }}
                    >
                      {activeSystem.label}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
                      {activeStructure.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
                    Clinical pearl
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink)]">
                    <span className="font-semibold">{activeStructure.pearHigh}</span>
                    {activeStructure.pearl.replace(activeStructure.pearHigh, "")}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
                      Procedures
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {activeStructure.procedures.map((p) => (
                        <li key={p} className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-muted)]" aria-hidden />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
                      Key drugs
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {activeStructure.drugs.map((d) => (
                        <li key={d} className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-muted)]" aria-hidden />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-muted)]">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    {activeStructure.questions}+ related questions
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-muted)]">
                    {activeStructure.procedures.length} procedures
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-muted)]">
                    {activeStructure.drugs.length} drug links
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Trial gate overlay */}
            <AnimatePresence>
              {isGated && (
                <TrialGateOverlay systemsExplored={systemsExplored} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Comparison strip ── */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <div className="grid grid-cols-[1fr_auto_auto] items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            <span>Feature</span>
            <span className="w-28 text-center">Typical QBank</span>
            <span
              className="w-28 text-center"
              style={{ color: "var(--color-accent)" }}
            >
              Anatomy Studio
            </span>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_auto_auto] items-center px-5 py-3 text-sm ${
                i % 2 === 1 ? "bg-[var(--color-surface)]/40" : ""
              }`}
            >
              <span className="font-medium text-[var(--color-ink)]">{row.feature}</span>
              <span className="flex w-28 justify-center">
                {row.others === false ? (
                  <Minus className="h-4 w-4 text-[var(--color-ink-muted)]/50" strokeWidth={2} aria-label="No" />
                ) : (
                  <span className="text-[0.625rem] font-semibold text-[var(--color-ink-muted)]">{row.others}</span>
                )}
              </span>
              <span className="flex w-28 justify-center">
                <Check className="h-4 w-4 text-teal-600" strokeWidth={2.5} aria-label="Yes" />
              </span>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link
            href={LANDING_TRIAL_HREF}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-surface)] transition hover:opacity-90"
          >
            Try Anatomy Studio free
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <p className="text-[0.6875rem] text-[var(--color-ink-muted)]">
            Included in every plan · 14-day free trial · 32 structures · 9 body systems · CT Atlas · guided tours
          </p>
        </div>

      </div>
    </section>
  );
}
