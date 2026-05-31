import { Award, BookOpen, ShieldCheck, TrendingUp } from "lucide-react";

const signals = [
  {
    icon: BookOpen,
    value: "12,000+",
    label: "Board-style questions",
  },
  {
    icon: TrendingUp,
    value: "Adaptive",
    label: "AI difficulty engine",
  },
  {
    icon: Award,
    value: "NCLEX NGN",
    label: "USMLE · NAPLEX · INBDE",
  },
  {
    icon: ShieldCheck,
    value: "Encrypted",
    label: "HIPAA-aware · Cancel anytime",
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
          className="rounded-xl border border-teal-100/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm dark:border-teal-900/30 dark:bg-slate-900/40 sm:px-4 sm:py-3.5 lg:text-left"
        >
          <Icon
            className="mx-auto h-4 w-4 text-teal-600 dark:text-teal-400 lg:mx-0"
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="mt-0.5 text-[0.6875rem] leading-snug text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

