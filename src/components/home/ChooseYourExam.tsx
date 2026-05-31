"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  Pill,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

type ExamCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  tags: string[];
  span: string;
};

const exams: ExamCard[] = [
  {
    id: "nclex",
    title: "NCLEX NGN",
    subtitle: "Next-Generation NCLEX-RN",
    description:
      "Unfolding cases, bow-tie, matrix grids, SATA, and classic prioritization items.",
    href: "/study?field=nursing",
    icon: HeartPulse,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    tags: ["NGN formats", "Pharmacology", "Med-surg"],
    span: "lg:col-span-2",
  },
  {
    id: "usmle",
    title: "USMLE Step 1 & 2",
    subtitle: "Medicine · Clinical boards",
    description:
      "High-yield vignettes, pathophysiology, diagnostics, and Step 2 CK-style decision-making.",
    href: "/study?field=medicine",
    icon: Stethoscope,
    gradient: "from-teal-500 to-cyan-600",
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    tags: ["Step 1", "Step 2 CK", "Clinical vignettes"],
    span: "lg:col-span-2",
  },
  {
    id: "naplex",
    title: "NAPLEX",
    subtitle: "Pharmacy licensure",
    description:
      "Calculations, drug interactions, therapeutic alternatives, and patient counseling scenarios.",
    href: "/study?field=pharmacy",
    icon: Pill,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    tags: ["Dosing", "Interactions", "Therapeutics"],
    span: "lg:col-span-2",
  },
  {
    id: "inbde",
    title: "INBDE",
    subtitle: "Integrated dental boards",
    description:
      "Oral pathology, radiology, restorative dentistry, pharmacology, and treatment planning.",
    href: "/study?field=dentistry",
    icon: GraduationCap,
    gradient: "from-cyan-500 to-sky-600",
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    tags: ["Radiographs", "Pathology", "Restorative"],
    span: "lg:col-span-3",
  },
  {
    id: "others",
    title: "Others",
    subtitle: "SAT · Biology · Chemistry · Math",
    description:
      "Explore every discipline — adaptive banks, analytics, and mock exams across STEM and pre-professional prep.",
    href: "/study",
    icon: LayoutGrid,
    gradient: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    tags: ["SAT", "Sciences", "All subjects"],
    span: "lg:col-span-3",
  },
];

export function ChooseYourExam() {
  return (
    <section
      id="choose-exam"
      className="relative overflow-hidden py-[clamp(4rem,10vw,6.5rem)]"
      aria-labelledby="choose-exam-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(8,145,178,0.06),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Start here</p>
          <h2
            id="choose-exam-heading"
            className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-slate-900 dark:text-white"
          >
            Choose Your Exam
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400">
            Pick your board and jump straight into adaptive questions, analytics,
            and study plans tailored to your exam.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {exams.map((exam, i) => {
            const Icon = exam.icon;
            return (
              <motion.li
                key={exam.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={exam.span}
              >
                <Link href={exam.href} className="aee-exam-card group block h-full" aria-label={`Start ${exam.title} prep — ${exam.subtitle}`}>
                  <span
                    className={`aee-exam-card-bar bg-gradient-to-r ${exam.gradient}`}
                    aria-hidden
                  />

                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${exam.iconBg}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-teal-500 dark:text-slate-600 dark:group-hover:text-teal-400"
                      aria-hidden
                    />
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-teal-700 dark:text-teal-400">
                    {exam.subtitle}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
                    {exam.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {exam.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[0.6875rem] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-teal-400">
                    Start studying
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
