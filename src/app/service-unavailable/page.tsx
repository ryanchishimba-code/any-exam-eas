import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Temporarily unavailable — Any Exam Easy",
  robots: { index: false, follow: false },
};

export default function ServiceUnavailablePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-ink)]">
        We&apos;re reconnecting to the study database
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Your account is fine — Neon Postgres had a brief connection blip. This usually clears in a
        few seconds. You were not signed out.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={ROUTES.dashboard}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </Link>
        <Link
          href={ROUTES.home}
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
