"use client";

import { useEffect, useState } from "react";
import { BookOpen, Layers, Sparkles } from "lucide-react";

type CatalogResponse = {
  totalQuestions: number;
  subjects: { fieldId: string; title: string; questionCount: number }[];
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k+`;
  return n > 0 ? `${n}+` : "—";
}

export function LiveBankStats({ className = "" }: { className?: string }) {
  const [stats, setStats] = useState<CatalogResponse | null>(null);

  useEffect(() => {
    fetch("/api/catalog/subjects")
      .then((r) => r.json())
      .then((data: CatalogResponse) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const total = stats?.totalQuestions ?? 0;
  const nursing =
    stats?.subjects.find((s) => s.fieldId === "nursing")?.questionCount ?? 0;

  const items = [
    {
      icon: BookOpen,
      value: total > 0 ? formatCount(total) : "Board-style",
      label: "Practice questions",
    },
    {
      icon: Sparkles,
      value: "NGN formats",
      label: "Bow-tie · Matrix · SATA",
    },
    {
      icon: Layers,
      value: nursing > 0 ? formatCount(nursing) : "NCLEX",
      label: "Nursing bank",
    },
  ];

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {items.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="rounded-xl border border-teal-100/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-3.5"
        >
          <Icon
            className="mx-auto h-4 w-4 text-teal-600"
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-sm font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-0.5 text-[0.625rem] leading-snug text-slate-500 sm:text-[0.6875rem]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
