"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Quote, TrendingUp } from "lucide-react";

type Review = {
  id: string;
  name: string;
  initials: string;
  avatarClass: string;
  exam: string;
  examLabel: string;
  scoreBefore: number;
  scoreAfter: number;
  quote: string;
  detail: string;
};

const reviews: Review[] = [
  {
    id: "sarah-m",
    name: "Sarah M., RN",
    initials: "SM",
    avatarClass: "from-teal-500 to-cyan-600",
    exam: "NCLEX-RN",
    examLabel: "NCLEX NGN · First attempt pass",
    scoreBefore: 54,
    scoreAfter: 89,
    quote:
      "The NGN case studies felt exactly like exam day. Weak-area targeting pushed me through pharmacology — I went from guessing to actually understanding rationales.",
    detail: "BSN · University of Texas",
  },
  {
    id: "james-o",
    name: "James O.",
    initials: "JO",
    avatarClass: "from-cyan-500 to-sky-600",
    exam: "USMLE Step 1",
    examLabel: "Step 1 · Pass",
    scoreBefore: 58,
    scoreAfter: 81,
    quote:
      "Adaptive questions kept me honest. When I missed pathology, the engine queued similar items until it clicked. My practice scores finally matched how I felt on test day.",
    detail: "MD candidate · Ohio State",
  },
  {
    id: "priya-k",
    name: "Priya K., BSN",
    initials: "PK",
    avatarClass: "from-sky-500 to-blue-600",
    exam: "NCLEX-RN",
    examLabel: "NCLEX NGN · First attempt pass",
    scoreBefore: 62,
    scoreAfter: 91,
    quote:
      "OER-backed explanations saved me — every wrong answer had a citation I could trust. The readiness score told me when to schedule, and I passed on my first try.",
    detail: "BSN · UCLA Nursing",
  },
  {
    id: "maria-l",
    name: "Maria L.",
    initials: "ML",
    avatarClass: "from-teal-600 to-emerald-600",
    exam: "USMLE Step 2 CK",
    examLabel: "Step 2 CK · Pass",
    scoreBefore: 65,
    scoreAfter: 84,
    quote:
      "Personalized study plans cut my prep time in half. Instead of re-reading everything, I drilled weak clerkship topics with board-style vignettes. Worth every dollar.",
    detail: "MD · Internal Medicine",
  },
];

function Avatar({ initials, avatarClass }: { initials: string; avatarClass: string }) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarClass} text-sm font-semibold text-white shadow-sm`}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function ScoreImprovement({ before, after }: { before: number; after: number }) {
  const delta = after - before;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-teal-100/80 bg-teal-50/50 px-3 py-2 dark:border-teal-900/40 dark:bg-teal-950/30">
      <TrendingUp className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
      <div className="min-w-0">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Readiness score
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {before}%{" "}
          <span className="font-normal text-slate-400">→</span> {after}%
          <span className="ml-1.5 text-teal-600 dark:text-teal-400">+{delta}%</span>
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      className="aee-landing-section relative overflow-hidden bg-[#fbfbfd] dark:bg-[#0a0a0a]"
      aria-labelledby="testimonials-heading"
    >
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-section-label">Student stories</p>
          <h2 id="testimonials-heading" className="aee-headline mt-4">
            Trusted by NCLEX &amp; USMLE students
          </h2>
          <p className="aee-section-lede mx-auto max-w-xl">
            Real outcomes from nursing and medical students who used adaptive
            prep to raise readiness and pass their boards.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {reviews.map((review, i) => (
            <motion.li
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <article className="aee-testimonial-card h-full">
                <Quote
                  className="h-8 w-8 text-teal-200 dark:text-teal-800"
                  strokeWidth={1.5}
                  aria-hidden
                />

                <blockquote className="mt-4 flex-1">
                  <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </blockquote>

                <ScoreImprovement before={review.scoreBefore} after={review.scoreAfter} />

                <footer className="mt-5 flex items-start gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <Avatar initials={review.initials} avatarClass={review.avatarClass} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {review.detail}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-teal-800 dark:border-teal-800/50 dark:bg-teal-950/50 dark:text-teal-300">
                        {review.exam}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-200">
                        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden />
                        {review.examLabel}
                      </span>
                    </div>
                  </div>
                </footer>
              </article>
            </motion.li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-slate-400">
          Individual results vary. Testimonials reflect self-reported study outcomes
          and are not a guarantee of exam performance.
        </p>
      </div>
    </section>
  );
}
