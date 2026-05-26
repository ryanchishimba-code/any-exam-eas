import Link from "next/link";
import { EmployeeAccessLink } from "@/components/EmployeeAccessLink";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.04] bg-[var(--color-surface)] py-16">
      <div className="mx-auto grid max-w-[980px] gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-[1.0625rem] font-semibold tracking-tight">Any Exam Easy</p>
          <p className="mt-3 max-w-md text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
            AI-powered exams and adaptive learning quilts for medicine, nursing, and pharmacy.
          </p>
        </div>
        <div>
          <p className="apple-label">Product</p>
          <ul className="mt-4 space-y-2.5 text-[0.875rem] text-[var(--color-ink-muted)]">
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/study">
                Study hub
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/learn">
                Flashcards
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/generate">
                Exam questions
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/progress">
                Progress tracker
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/pricing">
                Pricing
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/feedback">
                Feedback
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="apple-label">Legal</p>
          <ul className="mt-4 space-y-2.5 text-[0.875rem] text-[var(--color-ink-muted)]">
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/legal/terms">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[var(--color-ink)]" href="/legal/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-[var(--color-ink)]"
                href="/legal/disclaimer"
              >
                Disclaimers
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[980px] flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between">
        <EmployeeAccessLink />
        <p className="text-center text-[0.75rem] text-[var(--color-ink-muted)] sm:text-right">
          © {new Date().getFullYear()} Any Exam Easy. For users 18+. Not affiliated with
          accrediting bodies or licensure boards.
        </p>
      </div>
    </footer>
  );
}
