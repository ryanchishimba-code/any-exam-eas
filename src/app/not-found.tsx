import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        404
      </p>
      <h1 className="apple-display mt-3 text-[clamp(2rem,5vw,2.75rem)]">Page not found.</h1>
      <p className="apple-subhead mt-4 text-[var(--color-ink-muted)]">
        That link may be outdated. Head back to StudyGub or the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="login-modal-btn-primary inline-flex px-6 py-3">
          Home
        </Link>
        <Link
          href="/studygub"
          className="inline-flex items-center rounded-full border border-black/[0.08] px-6 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-black/[0.03]"
        >
          StudyGub
        </Link>
      </div>
    </div>
  );
}
