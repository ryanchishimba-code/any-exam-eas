import { Award, BookOpen, ShieldCheck, Sparkles } from "lucide-react";

const signals = [
  {
    icon: BookOpen,
    value: "130K+",
    label: "Board-style questions",
  },
  {
    icon: Sparkles,
    value: "Adaptive",
    label: "AI weak-area targeting",
  },
  {
    icon: Award,
    value: "4 exams",
    label: "NCLEX · USMLE · NAPLEX · MPJE",
  },
  {
    icon: ShieldCheck,
    value: "OER-backed",
    label: "Trusted explanations",
  },
];

type HeroTrustSignalsProps = {
  className?: string;
};

export function HeroTrustSignals({ className = "" }: HeroTrustSignalsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {signals.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="rounded-xl border border-teal-100/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-3.5 lg:text-left"
        >
          <Icon
            className="mx-auto h-4 w-4 text-teal-600 lg:mx-0"
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-sm font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-0.5 text-[0.6875rem] leading-snug text-slate-500">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
