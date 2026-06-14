"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { SubjectCatalogEntry } from "@/lib/subjects/catalog";
import { AppleLink } from "@/components/ui/AppleLink";
import { PageMemberAccess } from "@/components/home/PageMemberAccess";

type CatalogResponse = {
  subjects: (SubjectCatalogEntry & { questionCount?: number })[];
  trending?: SubjectCatalogEntry[];
  recommended?: SubjectCatalogEntry[];
};

export function SubjectsShowcase() {
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog/subjects")
      .then((r) => r.json())
      .then((d: CatalogResponse) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const subjects = data?.subjects ?? [];

  return (
    <section id="subjects" className="apple-section aee-landing-section bg-white">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="aee-section-label">Exam coverage</p>
          <h2 className="aee-headline mt-4">Study support across boards.</h2>
          <p className="aee-section-lede mx-auto mt-4 max-w-xl">
            Timed exams, question banks, and progress tracking for NCLEX,
            NCLEX, USMLE, NAPLEX, and MPJE.
          </p>
        </div>

        {loading && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl bg-teal-50/50"
              />
            ))}
          </div>
        )}

        {!loading && subjects.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, i) => (
              <SubjectTile key={subject.fieldId} subject={subject} index={i} />
            ))}
          </div>
        )}

        <p className="mt-12 text-center">
          <AppleLink href="/study">Open study hub</AppleLink>
        </p>
        <PageMemberAccess className="mt-6 text-center" />
      </div>
    </section>
  );
}

function SubjectTile({
  subject,
  index,
}: {
  subject: SubjectCatalogEntry & { questionCount?: number };
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="aee-card group flex flex-col p-6 text-left"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
        <GraduationCap className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
        {subject.label}
      </h3>
      <p className="mt-1 text-sm font-medium text-teal-700/80">
        {subject.boardExam}
      </p>
      <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
        {subject.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-[0.6875rem] font-medium text-slate-400">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5">
          {subject.questionCount ?? "—"} questions
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5">
          {subject.topicCount} topics
        </span>
      </div>
      <Link
        href={`/question-bank?field=${subject.fieldId}`}
        className="mt-5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
      >
        Learn more →
      </Link>
    </motion.article>
  );
}
