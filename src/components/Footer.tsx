import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[var(--color-surface)] py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold">Any Exam Easy</p>
          <p className="mt-2 max-w-md text-sm text-[var(--color-ink-muted)]">
            AI-powered exams and adaptive learning quilts for every field — from
            K–12 to medicine, nursing, pharmacy, and engineering.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Product
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/generate">Generate exams</Link></li>
            <li><Link href="/learn">Learning quilt</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/legal/terms">Terms of Service</Link></li>
            <li><Link href="/legal/privacy">Privacy Policy</Link></li>
            <li><Link href="/legal/disclaimer">Disclaimers</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl px-6 text-center text-xs text-[var(--color-ink-muted)]">
        © {new Date().getFullYear()} Any Exam Easy. For users 18+. Not affiliated with
        accrediting bodies or licensure boards.
      </p>
    </footer>
  );
}
