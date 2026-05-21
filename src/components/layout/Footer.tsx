import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">Any Exam Easy</p>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              AI-powered exams and adaptive learning for every field.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/generate" className="hover:underline">
              Generate exams
            </Link>
            <Link href="/learn" className="hover:underline">
              Learning quilt
            </Link>
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/legal/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/legal/disclaimer" className="hover:underline">
              Educational disclaimer
            </Link>
          </div>
        </div>
        <p className="mt-10 text-xs text-[var(--color-ink-muted)]">
          © {new Date().getFullYear()} Any Exam Easy. For users 18+. Not affiliated with
          licensing boards or accrediting bodies.
        </p>
      </div>
    </footer>
  );
}
