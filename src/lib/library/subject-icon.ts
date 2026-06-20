import {
  Activity,
  Baby,
  Bone,
  BookOpen,
  Brain,
  Bug,
  Calculator,
  ClipboardCheck,
  Droplets,
  FlaskConical,
  Heart,
  HeartPulse,
  Pill,
  Scale,
  ShieldCheck,
  Stethoscope,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type SubjectVisual = {
  icon: LucideIcon;
  /** Soft tint classes for the icon chip (bg + foreground). */
  tint: string;
};

/**
 * Map a free-form memory-card `subject` to a consistent Apple-style glyph + tint.
 * Keyword rules keep the look stable even though subject strings vary across
 * exams (e.g. "Cardiology" vs "Cardiovascular"). First match wins.
 */
const RULES: Array<{ test: RegExp; icon: LucideIcon; tint: string }> = [
  { test: /cardio|cardiac|heart/i, icon: Heart, tint: "bg-rose-500/12 text-rose-600" },
  { test: /vascular|circulat/i, icon: HeartPulse, tint: "bg-rose-500/12 text-rose-600" },
  { test: /neuro|nerv|brain|stroke|psych|behavioral|mental/i, icon: Brain, tint: "bg-violet-500/12 text-violet-600" },
  { test: /infect|microb|antibiotic|sepsis|id\b/i, icon: Bug, tint: "bg-lime-600/12 text-lime-700" },
  { test: /pulmon|respir|lung|copd|airway|cardiopulmonary/i, icon: Wind, tint: "bg-sky-500/12 text-sky-600" },
  { test: /pharma|drug|medication|therap(y|eutics)/i, icon: Pill, tint: "bg-indigo-500/12 text-indigo-600" },
  { test: /nephro|renal|kidney|electrolyte|fluid/i, icon: Droplets, tint: "bg-cyan-500/12 text-cyan-600" },
  { test: /endocrin|diabet|metabolic|insulin|thyroid/i, icon: Activity, tint: "bg-amber-500/12 text-amber-600" },
  { test: /lab|diagnostic|biostat/i, icon: FlaskConical, tint: "bg-teal-500/12 text-teal-600" },
  { test: /pediatr|child|neonat/i, icon: Baby, tint: "bg-pink-500/12 text-pink-600" },
  { test: /safety|infection control|protection/i, icon: ShieldCheck, tint: "bg-emerald-500/12 text-emerald-600" },
  { test: /law|legal|ethic|professional|practice|regulat/i, icon: Scale, tint: "bg-slate-500/12 text-slate-600" },
  { test: /calcul|math|dosage|compound/i, icon: Calculator, tint: "bg-orange-500/12 text-orange-600" },
  { test: /musculoskeletal|msk|ortho|bone|joint|rotator/i, icon: Bone, tint: "bg-stone-500/12 text-stone-600" },
  { test: /modalit|equipment|device|technolog/i, icon: Wrench, tint: "bg-zinc-500/12 text-zinc-600" },
  { test: /critical|emergency|acute|management of care|assess|diagnose|plan|evaluate/i, icon: ClipboardCheck, tint: "bg-blue-500/12 text-blue-600" },
  { test: /reproduct|ob\/?gyn|women|geriatr/i, icon: Stethoscope, tint: "bg-fuchsia-500/12 text-fuchsia-600" },
];

const FALLBACK: SubjectVisual = { icon: BookOpen, tint: "bg-black/[0.05] text-[var(--color-ink-muted)]" };

export function subjectVisual(subject: string): SubjectVisual {
  for (const rule of RULES) {
    if (rule.test.test(subject)) return { icon: rule.icon, tint: rule.tint };
  }
  return FALLBACK;
}
