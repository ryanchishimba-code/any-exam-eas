"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, Pill, Scale, Stethoscope, type LucideIcon } from "lucide-react";
import { studyHubMpjeHref } from "@/lib/study-hub/config";

type ExamCard = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  theme: "nclex" | "usmle" | "naplex" | "mpje";
  tagline: string;
};

const exams: ExamCard[] = [
  {
    id: "nclex",
    title: "NCLEX",
    href: "/question-bank?field=nursing",
    icon: HeartPulse,
    theme: "nclex",
    tagline: "Clinical judgment, NGN formats & prioritization",
  },
  {
    id: "usmle",
    title: "USMLE",
    href: "/question-bank?field=usmle-step-2",
    icon: Stethoscope,
    theme: "usmle",
    tagline: "Clinical vignettes & next-best-step reasoning",
  },
  {
    id: "naplex",
    title: "NAPLEX",
    href: "/question-bank?field=pharmacy",
    icon: Pill,
    theme: "naplex",
    tagline: "Calculations, cases & pharmacotherapy",
  },
  {
    id: "mpje",
    title: "MPJE",
    href: studyHubMpjeHref(),
    icon: Scale,
    theme: "mpje",
    tagline: "Uniform MPJE & state-specific law",
  },
];

export function ChooseYourExam() {
  return (
    <section
      id="choose-exam"
      className="aee-landing-section bg-white"
      aria-labelledby="choose-exam-heading"
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Exam coverage</p>
          <h2 id="choose-exam-heading" className="aee-headline mt-3">
            Four boards.{" "}
            <span className="aee-display-accent">One subscription.</span>
          </h2>
          <p className="aee-section-lede mx-auto mt-4 max-w-xl">
            NCLEX, USMLE, NAPLEX, and MPJE — each with timed simulations, topic banks,
            and rationales grounded in open educational resources.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {exams.map((exam, i) => {
            const Icon = exam.icon;
            return (
              <motion.li
                key={exam.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={exam.href}
                  data-theme={exam.theme}
                  className="aee-exam-card aee-exam-card-minimal group block h-full"
                  aria-label={`Start ${exam.title} prep`}
                >
                  <span className="aee-exam-icon-wrap aee-exam-icon-wrap-minimal">
                    <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="aee-exam-title mt-4 text-xl">{exam.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{exam.tagline}</p>
                  <span className="aee-exam-cta mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                    Start studying
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
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
