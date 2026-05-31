"use client";

import Image from "next/image";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { HERO_IMAGE_ALT, HERO_IMAGE_PATH } from "@/lib/hero-assets";

const highlights = [
  "NCLEX NGN case studies",
  "OER-backed rationales",
  "Readiness score tracking",
];

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <figure className="relative overflow-hidden rounded-2xl border border-teal-100/80 shadow-[0_24px_64px_rgba(13,148,136,0.15)] dark:border-teal-900/40">
        <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
          <Image
            src={HERO_IMAGE_PATH}
            alt={HERO_IMAGE_ALT}
            fill
            priority
            quality={82}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 520px"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"
            aria-hidden
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Any Exam Easy
            </p>
            <p className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl">
              Study like you&apos;re already on the wards.
            </p>
            <ul className="mt-3 space-y-1.5" aria-label="Platform highlights">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-200"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </figcaption>
        </div>
      </figure>

      <div
        className="absolute -left-2 top-8 z-10 rounded-xl border border-white/20 bg-white/95 p-3.5 shadow-[0_12px_40px_rgba(13,148,136,0.2)] backdrop-blur-md dark:bg-slate-900/95 sm:-left-6 sm:p-4"
        role="img"
        aria-label="Sample readiness score: 78 percent, up 12 percent this week"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
            <BarChart3 className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </span>
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-slate-400">
              Readiness
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">78%</p>
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-teal-600 dark:text-teal-400">
          ↑ 12% this week
        </p>
      </div>

      <aside
        className="absolute -right-2 bottom-24 z-10 rounded-xl border border-teal-200/60 bg-teal-50/95 px-4 py-3 shadow-lg backdrop-blur-md dark:border-teal-800/40 dark:bg-teal-950/90 sm:-right-4"
        aria-label="Next recommended study topic: Pharmacology question 4"
      >
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
          Next up
        </p>
        <p className="mt-0.5 text-sm font-bold text-teal-950 dark:text-teal-50">
          Pharmacology · Q4
        </p>
        <p className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
          Pick up where you left off →
        </p>
      </aside>

      <div
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />
    </div>
  );
}
