/** Decorative product-style graphic for the hero (pure SVG, no external assets). */
export function HeroVisual() {
  return (
    <div
      className="relative mx-auto mt-14 w-full max-w-3xl px-4"
      aria-hidden
    >
      <div className="apple-card overflow-hidden p-6 shadow-[var(--shadow-apple-lg)] md:p-8">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-medium text-[var(--color-ink-muted)]">
            Exam preview
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3 rounded-2xl bg-[var(--color-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              Question 3 of 10
            </p>
            <p className="text-sm font-medium leading-snug text-[var(--color-ink)]">
              Which tissue type forms tendons and ligaments?
            </p>
            <ul className="mt-4 space-y-2">
              {["Epithelial", "Connective", "Muscle", "Nervous"].map((opt, i) => (
                <li
                  key={opt}
                  className={`rounded-xl border px-3 py-2.5 text-sm ${
                    i === 1
                      ? "border-[var(--color-accent)] bg-blue-50/80 text-[var(--color-ink)]"
                      : "border-black/[0.06] bg-white text-[var(--color-ink-muted)]"
                  }`}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#40a9ff] p-5 text-white">
              <p className="text-xs font-medium opacity-90">Learning quilt</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">24 tiles</p>
              <p className="mt-1 text-xs opacity-80">Flashcards · Quiz · Mixed</p>
            </div>
            <div className="apple-card flex-1 p-4">
              <p className="text-xs text-[var(--color-ink-muted)]">Sources reviewed</p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-ink)]">7 OER + web</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                <div className="h-full w-[72%] rounded-full bg-[var(--color-accent)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[rgba(0,113,227,0.12)] blur-2xl"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[rgba(120,120,128,0.1)] blur-3xl"
      />
    </div>
  );
}
