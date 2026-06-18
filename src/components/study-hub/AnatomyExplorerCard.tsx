import Link from "next/link";
import { ArrowRight, Bone } from "lucide-react";
import { ANATOMY_EXPLORER_PATH } from "@/lib/study-hub/config";

export function AnatomyExplorerCard() {
  return (
    <Link
      href={ANATOMY_EXPLORER_PATH}
      className="group flex items-center justify-between gap-4 rounded-[22px] border border-black/[0.06] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white p-2.5 text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
          <Bone className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold tracking-tight text-[var(--color-ink)]">
            Anatomy Explorer
          </h3>
          <p className="mt-1 max-w-md text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            Orbit a 3D body, explore high-yield structures, and jump to clinical pearls and
            board-style practice.
          </p>
        </div>
      </div>
      <ArrowRight
        className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
        aria-hidden
      />
    </Link>
  );
}
