import { BookOpen, Lock, ShieldCheck, Stethoscope } from "lucide-react";
import { PLATFORM_EXAM_LIST_MIDDOT } from "@/lib/landing/content";

const items = [
  { icon: Stethoscope, label: `${PLATFORM_EXAM_LIST_MIDDOT} prep` },
  { icon: BookOpen, label: "Board-style questions + rationales" },
  { icon: ShieldCheck, label: "Adaptive weak-area practice" },
  { icon: Lock, label: "One plan · Cancel anytime" },
];

type TrustBarProps = {
  className?: string;
};

export function TrustBar({ className = "" }: TrustBarProps) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs text-[var(--color-ink-muted)] ${className}`}
    >
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}
