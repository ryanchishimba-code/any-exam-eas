"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  HeartPulse,
  Layers,
  Lightbulb,
  Pill,
  Stethoscope,
  Target,
  Tags,
} from "lucide-react";
import { DRUG_CLASSES } from "@/lib/drugs300/drug-classes";

const DRUG_REVIEW_HREF = "/study/drugs300";

const EXAMS = [
  { id: "nclex", label: "NCLEX", icon: HeartPulse, color: "#0d9488", bg: "bg-teal-50", ring: "ring-teal-200/80" },
  { id: "usmle", label: "USMLE", icon: Stethoscope, color: "#2563eb", bg: "bg-blue-50", ring: "ring-blue-200/80" },
  { id: "naplex", label: "NAPLEX", icon: Pill, color: "#7c3aed", bg: "bg-violet-50", ring: "ring-violet-200/80" },
] as const;

const BENEFITS = [
  { icon: Layers, label: "Organized by drug class", color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Tags, label: "Generic + brand names", color: "text-sky-600", bg: "bg-sky-50" },
  { icon: Target, label: "Indications", color: "text-cyan-600", bg: "bg-cyan-50" },
  { icon: AlertTriangle, label: "Side effects", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Lightbulb, label: "Mnemonics", color: "text-violet-600", bg: "bg-violet-50" },
] as const;

const FEATURED_CLASSES = DRUG_CLASSES.filter((c) => c.id !== "all").slice(0, 6);

const SAMPLE_CARD = {
  generic: "Lisinopril",
  brand: "Prinivil®",
  classId: "cardiovascular" as const,
  indication: "Hypertension, heart failure",
  sideEffect: "Dry cough, hyperkalemia",
  mnemonic: "Lisinopril — ACE the pressure",
};

export function Top500DrugsInfographic() {
  const sampleClass = DRUG_CLASSES.find((c) => c.id === SAMPLE_CARD.classId)!;

  return (
    <section
      id="top-500-drugs"
      className="aee-drugs-infographic aee-landing-section relative overflow-hidden"
      aria-labelledby="top-500-drugs-heading"
    >
      <div className="aee-drugs-infographic-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Copy + benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="aee-section-label">Pharmacology mastery</p>
            <h2 id="top-500-drugs-heading" className="aee-headline mt-3">
              Top 500{" "}
              <span className="aee-display-accent">Drugs.</span>
            </h2>
            <p className="aee-section-lede mt-4 max-w-lg">
              One high-yield deck shared across NCLEX, USMLE, and NAPLEX — the most
              prescribed medications, organized the way boards actually test them.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Supported exams">
              {EXAMS.map((exam) => {
                const Icon = exam.icon;
                return (
                  <li key={exam.id}>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${exam.bg} ${exam.ring}`}
                      style={{ color: exam.color }}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {exam.label}
                    </span>
                  </li>
                );
              })}
              <li>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80">
                  <BookMarked className="h-3.5 w-3.5" aria-hidden />
                  One shared deck
                </span>
              </li>
            </ul>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
              {BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.li
                    key={benefit.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-white/80 px-3.5 py-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${benefit.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${benefit.color}`} strokeWidth={2} aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-slate-800">{benefit.label}</span>
                  </motion.li>
                );
              })}
            </ul>

            <Link
              href={DRUG_REVIEW_HREF}
              className="aee-btn-hero group mt-10 inline-flex items-center justify-center gap-2"
            >
              Master the Most Prescribed Medications
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>

          {/* Infographic visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative"
          >
            <div className="aee-drugs-infographic-panel">
              {/* Exam orbit */}
              <div className="aee-drugs-infographic-orbit" aria-hidden>
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 120"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M 70 90 Q 200 20 330 90"
                    fill="none"
                    stroke="url(#orbit-gradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    opacity="0.5"
                  />
                  <defs>
                    <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0d9488" />
                      <stop offset="50%" stopColor="#0891b2" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                <ul className="relative flex items-end justify-between px-2">
                  {EXAMS.map((exam, i) => {
                    const Icon = exam.icon;
                    return (
                      <motion.li
                        key={exam.id}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ring-1 ${exam.bg} ${exam.ring}`}
                        >
                          <Icon className="h-5 w-5" style={{ color: exam.color }} aria-hidden />
                        </span>
                        <span
                          className="text-[0.6875rem] font-bold uppercase tracking-wide"
                          style={{ color: exam.color }}
                        >
                          {exam.label}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* Central hub */}
              <div className="aee-drugs-infographic-hub">
                <div className="aee-drugs-infographic-hub-ring" aria-hidden />
                <div className="relative text-center">
                  <p className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-teal-600">
                    High-yield deck
                  </p>
                  <p className="mt-1 text-5xl font-black tracking-tight text-slate-900">500</p>
                  <p className="text-sm font-semibold text-slate-600">Most prescribed drugs</p>
                </div>
              </div>

              {/* Therapeutic class grid */}
              <div className="mt-6">
                <p className="mb-3 text-center text-[0.6875rem] font-bold uppercase tracking-wider text-slate-400">
                  Color-coded by therapeutic class
                </p>
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {FEATURED_CLASSES.map((cls, i) => (
                    <motion.li
                      key={cls.id}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                    >
                      <div className="aee-drugs-class-pill group">
                        <span
                          className="aee-drugs-class-bar"
                          style={{ backgroundColor: cls.color }}
                          aria-hidden
                        />
                        <span className="mt-1 block text-[0.6875rem] font-bold leading-tight text-slate-700">
                          {cls.shortLabel}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Sample flashcard */}
              <article className="aee-drugs-flashcard-preview mt-6" aria-label="Sample drug flashcard">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{SAMPLE_CARD.generic}</p>
                    <p className="text-sm text-slate-500">{SAMPLE_CARD.brand}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: sampleClass.color }}
                  >
                    {sampleClass.shortLabel}
                  </span>
                </div>
                <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="aee-drugs-flashcard-field">
                    <dt className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-wide text-teal-600">
                      <Target className="h-3 w-3" aria-hidden />
                      Indication
                    </dt>
                    <dd className="mt-0.5 text-xs font-medium text-slate-700">
                      {SAMPLE_CARD.indication}
                    </dd>
                  </div>
                  <div className="aee-drugs-flashcard-field">
                    <dt className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-wide text-amber-600">
                      <AlertTriangle className="h-3 w-3" aria-hidden />
                      Side effect
                    </dt>
                    <dd className="mt-0.5 text-xs font-medium text-slate-700">
                      {SAMPLE_CARD.sideEffect}
                    </dd>
                  </div>
                </dl>
                <p className="aee-drugs-mnemonic mt-3 flex items-start gap-2 text-xs text-violet-800">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden />
                  <span>
                    <span className="font-semibold">Mnemonic:</span> {SAMPLE_CARD.mnemonic}
                  </span>
                </p>
              </article>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Spaced repetition · Filter by class · Search all 500 drugs
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
