import Link from "next/link";
import { MARKETING_BOARD_LINKS } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        404
      </p>
      <h1 className="apple-display mt-3 text-[clamp(2rem,5vw,2.75rem)]">Page not found.</h1>
      <p className="apple-subhead mt-4 text-[var(--color-ink-muted)]">
        That link may be outdated. Pick a board or head home.
      </p>
      <div className="mt-8">
        <Link href="/" className="login-modal-btn-primary inline-flex px-6 py-3">
          Home
        </Link>
      </div>
      <nav aria-label="Boards" className="mt-8 flex max-w-full flex-wrap justify-center gap-x-4 gap-y-2">
        {MARKETING_BOARD_LINKS.map((board) => (
          <Link
            key={board.href}
            href={board.href}
            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            {board.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
