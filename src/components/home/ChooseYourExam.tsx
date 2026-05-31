"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Pill,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

type ExamTheme = "nclex" | "usmle" | "naplex";

type ExamCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: LucideIcon;
  theme: ExamTheme;
  tags: string[];
  popular?: boolean;
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
    theme: "nclex",
    tags: ["NGN formats", "Pharmacology", "Med-surg"],
    popular: true,
  },
  {
    id: "usmle",
    title: "USMLE Step 1 & 2",
    subtitle: "Medicine · Clinical boards",
    description:
      "High-yield vignettes, pathophysiology, diagnostics, and Step 2 CK-style decision-making.",
    href: "/study?field=medicine",
    icon: Stethoscope,
    theme: "usmle",
    tags: ["Step 1", "Step 2 CK", "Clinical vignettes"],
    popular: true,
  },
  {
    id: "naplex",
    title: "NAPLEX",
    subtitle: "Pharmacy licensure",
    description:
      "Calculations, drug interactions, therapeutic alternatives, and patient counseling scenarios.",
    href: "/study?field=pharmacy",
    icon: Pill,
    theme: "naplex",
    tags: ["Dosing", "Interactions", "Therapeutics"],
    popular: true,
  },
];

export function ChooseYourExam() {
  return (
    <section
      id="choose-exam"
      className="aee-exams-section aee-landing-section relative overflow-hidden"
      aria-labelledby="choose-exam-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Start here</p>
          <h2 id="choose-exam-heading" className="aee-headline mt-4">
            Three boards. One study platform.
          </h2>
          <p className="aee-section-lede mx-auto max-w-xl">
            NCLEX NGN, USMLE, and NAPLEX — each with tailored question formats,
            progress tracking, and study paths designed to support licensure exam prep.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {exams.map((exam, i) => {
            const Icon = exam.icon;
            return (
              <motion.li
                key={exam.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  href={exam.href}
                  data-theme={exam.theme}
                  className="aee-exam-card aee-exam-card-premium group block h-full"
                  aria-label={`Start ${exam.title} prep — ${exam.subtitle}`}
                >
                  {exam.popular && (
                    <span className="aee-exam-popular-badge">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Popular
                    </span>
                  )}

                  <span className="aee-exam-card-bar" aria-hidden />

                  <div className="flex items-start justify-between gap-3">
                    <span className="aee-exam-icon-wrap">
                      <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                    </span>
                    <ArrowRight className="aee-exam-arrow h-6 w-6 shrink-0" aria-hidden />
                  </div>

                  <h3 className="aee-exam-title mt-5">{exam.title}</h3>
                  <p className="aee-exam-subtitle mt-1">{exam.subtitle}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-600">
                    {exam.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {exam.tags.map((tag) => (
                      <li key={tag} className="aee-exam-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <span className="aee-exam-cta mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                    Start studying
                    <ArrowRight className="h-4 w-4" aria-hidden />
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
