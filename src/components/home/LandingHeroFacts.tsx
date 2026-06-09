import {
  Brain,
  ClipboardList,
  Layers,
  Pill,
  type LucideIcon,
} from "lucide-react";

const FACTS: { icon: LucideIcon; label: string }[] = [
  { icon: Layers, label: "Question banks for NCLEX, USMLE, NAPLEX & MPJE" },
  { icon: Brain, label: "Adaptive practice that targets weak topics" },
  { icon: ClipboardList, label: "Timed full-length exam simulations" },
  { icon: Pill, label: "Top 500 pharmacology flashcards" },
];

export function LandingHeroFacts({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`grid gap-2 sm:grid-cols-2 ${className}`}
      aria-label="What Any Exam Easy includes"
    >
      {FACTS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-start gap-2 rounded-lg border border-teal-100/80 bg-white/70 px-2.5 py-2 text-left text-[0.6875rem] leading-snug text-slate-700 sm:text-xs"
        >
          <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2} aria-hidden />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
