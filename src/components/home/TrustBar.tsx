import { BookOpen, Lock, ShieldCheck, Stethoscope } from "lucide-react";

const items = [
  { icon: Stethoscope, label: "NCLEX · USMLE · NAPLEX" },
  { icon: BookOpen, label: "OER-backed rationales" },
  { icon: ShieldCheck, label: "Security-first infra" },
  { icon: Lock, label: "Encrypted & private" },
];

type TrustBarProps = {
  className?: string;
};

export function TrustBar({ className = "" }: TrustBarProps) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs text-slate-500 ${className}`}
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
