import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: { absolute: "NCLEX Study Hub — AnyExamEasy" },
  description:
    "NCLEX product hub: Study Guide reader, question bank practice, and full-length mocks. Independent prep — not affiliated with NCSBN.",
};

/**
 * Thin NCLEX product hub stub.
 * Does not replace ExamMarketingLanding for other exams; this static /nclex
 * route takes precedence over [examSlug] for NCLEX only.
 */
export default function NclexHubPage() {
  return (
    <main
      className="min-h-[100dvh] px-6 pb-16 pt-[calc(var(--page-top,4rem)+1.5rem)]"
      style={{ background: "#0b1c2c", color: "#e8eef4" }}
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="text-xs font-bold uppercase tracking-[0.18em]"
          style={{ color: "#2ec4b6" }}
        >
          NCLEX
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          NCLEX study hub
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
          Product entry for the NCLEX Study Guide reader (book/PDF surface). Question bank and
          timed exams stay on their existing routes — this hub does not invent clinical chapters.
        </p>

        <ul className="mt-10 space-y-3">
          <li>
            <Link
              href={ROUTES.nclexStudyGuide}
              className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-[#2ec4b6]/40 hover:bg-white/[0.07]"
            >
              <p className="text-sm font-bold" style={{ color: "#2ec4b6" }}>
                Study Guide
              </p>
              <p className="mt-1 text-sm text-white/65">
                All 16 chapters with clinical figures, in a book-style reader with highlights,
                bookmarks, notes, and saved progress.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href={ROUTES.questionBank + "?field=nursing"}
              className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/25"
            >
              <p className="text-sm font-bold text-white">Question bank</p>
              <p className="mt-1 text-sm text-white/65">
                Existing NCLEX QBank — unchanged in this pass.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/practice/nclex"
              className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/25"
            >
              <p className="text-sm font-bold text-white">Practice / Full Exam</p>
              <p className="mt-1 text-sm text-white/65">Existing practice entry points.</p>
            </Link>
          </li>
        </ul>

        <p className="mt-10 text-xs leading-relaxed text-white/40">
          Independent study aid. Not affiliated with NCSBN. No pass-rate claims.
        </p>
      </div>
    </main>
  );
}
