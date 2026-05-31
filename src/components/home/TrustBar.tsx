import { BookOpen, Lock, ShieldCheck, Stethoscope } from "lucide-react";

const items = [
  { icon: Stethoscope, label: "NCLEX · USMLE · NAPLEX" },
  { icon: BookOpen, label: "OER-backed rationales" },
  { icon: ShieldCheck, label: "SOC 2-ready infra" },
  { icon: Lock, label: "Encrypted & private" },
];

type TrustBarProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function TrustBar({ variant = "light", className = "" }: TrustBarProps) {
  const isDark = variant === "dark";

  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs ${
        isDark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
      } ${className}`}
    >
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon
            className={`h-3.5 w-3.5 shrink-0 ${
              isDark ? "text-teal-400" : "text-teal-600 dark:text-teal-400"
            }`}
            aria-hidden
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
