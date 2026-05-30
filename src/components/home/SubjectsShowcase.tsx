"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SubjectCatalogEntry } from "@/lib/subjects/catalog";
import { AppleLink } from "@/components/ui/AppleLink";

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
    <section id="subjects" className="apple-section">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="text-center">
          <h2 className="apple-headline">Prep for every board.</h2>
          <p className="apple-subhead mx-auto mt-4 max-w-xl">
            Adaptive exams, question banks, and analytics — medicine, nursing,
            pharmacy, dentistry, and core sciences.
          </p>
        </div>

        {loading && (
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-black/[0.04] dark:bg-white/[0.06]" />
            ))}
          </div>
        )}

        {!loading && subjects.length > 0 && (
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, i) => (
              <SubjectTile key={subject.fieldId} subject={subject} index={i} />
            ))}
          </div>
        )}

        <p className="mt-12 text-center">
          <AppleLink href="/study">Open study hub</AppleLink>
        </p>
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="apple-tile group flex flex-col p-6 text-center"
    >
      <h3 className="text-[1.3125rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
        {subject.label}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{subject.boardExam}</p>
      <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
        {subject.description}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2 text-[0.6875rem] text-[var(--color-ink-muted)]">
        <span>{subject.questionCount ?? "—"} questions</span>
        <span aria-hidden>·</span>
        <span>{subject.topicCount} topics</span>
      </div>
      <Link
        href={`/study?field=${subject.fieldId}`}
        className="mt-5 text-[var(--color-accent)] text-[0.9375rem] hover:underline"
      >
        Learn more
      </Link>
    </motion.article>
  );
}
