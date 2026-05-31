"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Pill,
  RefreshCw,
} from "lucide-react";

const DRUG_REVIEW_HREF = "/study/drugs300";

const highlights = [
  "Generic & brand names, MOA, and key side effects",
  "High-yield interactions, contraindications, and monitoring",
  "NCLEX prioritization and NAPLEX calculation-style items",
];

const sampleDrugs = [
  { name: "Metformin", tag: "DM2" },
  { name: "Warfarin", tag: "Anticoag" },
  { name: "Lisinopril", tag: "ACE-I" },
  { name: "Insulin glargine", tag: "Basal" },
  { name: "Furosemide", tag: "Loop diuretic" },
  { name: "Albuterol", tag: "SABA" },
];

export function Top300DrugsMastery() {
  return (
    <section
      id="top-300-drugs"
      className="aee-drugs-section aee-landing-section relative overflow-hidden"
      aria-labelledby="top-300-drugs-heading"
    >
      <div className="aee-drugs-section-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-500/10 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-100">
              <Pill className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
              Flagship review track
            </div>

            <h2
              id="top-300-drugs-heading"
              className="mt-5 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white"
            >
              Top 300 Drugs Mastery
            </h2>

            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-teal-50/90">
              Master the medications that show up again and again on board exams —
              with a curated list that&apos;s{" "}
              <strong className="font-semibold text-white">refreshed every 3 months</strong>{" "}
              so your prep stays current.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="aee-drugs-exam-badge">NCLEX-RN</span>
              <span className="aee-drugs-exam-badge">NAPLEX</span>
              <span className="aee-drugs-exam-badge aee-drugs-exam-badge-muted">
                Perfect for nursing &amp; pharmacy boards
              </span>
            </div>

            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-teal-50/95">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={DRUG_REVIEW_HREF}
                className="aee-drugs-cta group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold"
              >
                Start Drug Review
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <p className="flex items-center gap-2 text-sm text-teal-100/80">
                <CalendarClock className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden />
                New drug set every 3 months
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="aee-drugs-panel"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-cyan-200/90">
                  Current cycle
                </p>
                <p className="mt-1 text-2xl font-bold text-white">300 drugs</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-teal-50">
                <RefreshCw className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
                Refreshed quarterly
              </div>
            </div>

            <ul className="mt-5 space-y-2.5">
              {sampleDrugs.map((drug, i) => (
                <li
                  key={drug.name}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                  style={{ opacity: 1 - i * 0.06 }}
                >
                  <span className="font-medium text-white">{drug.name}</span>
                  <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-cyan-200">
                    {drug.tag}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-center text-xs text-teal-100/70">
              + 294 more in your adaptive drug review queue
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
