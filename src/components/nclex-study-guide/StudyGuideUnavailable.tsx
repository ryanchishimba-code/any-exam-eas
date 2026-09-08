import Link from "next/link";
import { ROUTES } from "@/lib/routes";

/**
 * Shown when the Study Guide cannot be reached — a Neon wake, a dropped
 * connection, or (locally) missing `sg_*` tables. Deliberately calmer than the
 * app error boundary, since the usual cause clears on its own.
 */
export function StudyGuideUnavailable() {
  return (
    <main
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: "#0b1c2c", color: "#e8eef4" }}
    >
      <h1 className="text-2xl font-bold">Study Guide is taking a moment</h1>
      <p className="max-w-md text-sm leading-relaxed text-white/65">
        We couldn&apos;t load the book just now. This is usually brief — try again in a few
        seconds.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Link
          href={ROUTES.nclexStudyGuide}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#0b1c2c]"
          style={{ background: "#2ec4b6" }}
        >
          Try again
        </Link>
        <Link
          href={ROUTES.nclexHub}
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80"
        >
          NCLEX hub
        </Link>
      </div>
      {process.env.NODE_ENV === "development" ? (
        <p className="max-w-md pt-2 text-xs text-white/40">
          Local setup: run the Prisma migration for the <code>sg_*</code> tables, then reload. See{" "}
          <code>DEV.md</code> in the study-guide module.
        </p>
      ) : null}
    </main>
  );
}
