import Link from "next/link";
import {
  NAPLEX_EXAM_FACTS,
  NAPLEX_OFFICIAL_LINKS,
  NAPLEX_OFFICIAL_LINKS_DISCLAIMER,
  NAPLEX_PRE_NAPLEX_LINK,
} from "@/lib/pharmacy/official-links";
import {
  NAPLEX_CALC_PATTERN_CARDS,
  NAPLEX_LAB_TEACHING_DISCLAIMER,
  NAPLEX_PRIORITY_LABS,
} from "@/lib/pharmacy/lab-teaching-ranges";
import { NAPLEX_PRIORITY_DRUG_KEYWORDS } from "@/lib/pharmacy/naplex-priority-drugs";
import { ROUTES } from "@/lib/routes";

/** Toolkit NAPLEX section — official NABP links, teaching labs, calcs, priority drugs. */
export function ToolkitNaplexMasterySection() {
  const drugPreview = NAPLEX_PRIORITY_DRUG_KEYWORDS.slice(0, 18);

  return (
    <section className="mx-auto mt-16 max-w-6xl px-6" aria-labelledby="toolkit-naplex-mastery">
      <h2
        id="toolkit-naplex-mastery"
        className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]"
      >
        NAPLEX Mastery toolkit
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Official NABP outline links, teaching lab ranges, calculation patterns, and high-yield
        drug families for Today&apos;s Skill Cell loop.
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/70 px-4 py-3 text-sm text-[var(--color-ink-muted)]">
        <p className="font-semibold text-[var(--color-ink)]">Exam facts (NABP)</p>
        <p className="mt-1">
          {NAPLEX_EXAM_FACTS.questions} · {NAPLEX_EXAM_FACTS.duration} · {NAPLEX_EXAM_FACTS.format}{" "}
          · {NAPLEX_EXAM_FACTS.result} · {NAPLEX_EXAM_FACTS.attempts}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Official NABP links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NAPLEX_OFFICIAL_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--color-accent)] hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={NAPLEX_PRE_NAPLEX_LINK.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {NAPLEX_PRE_NAPLEX_LINK.label}
              </a>
              <span className="mt-0.5 block text-[11px] text-[var(--color-ink-muted)]">
                NABP&apos;s own practice product — link only; we do not scrape it.
              </span>
            </li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            {NAPLEX_OFFICIAL_LINKS_DISCLAIMER}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Teaching labs</h3>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
            {NAPLEX_LAB_TEACHING_DISCLAIMER}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
            {NAPLEX_PRIORITY_LABS.map((lab) => (
              <li key={lab.id}>
                <span className="font-medium text-[var(--color-ink)]">{lab.label}</span>
                {" — "}
                {lab.teachingRange}
              </li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-semibold text-[var(--color-ink)]">
            Calculation patterns (Domain 1)
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {NAPLEX_CALC_PATTERN_CARDS.map((c) => c.label).join(" · ")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Priority drugs</h3>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
            Filtered against the Top 509 catalog for NAPLEX Today overweight — renal/hepatic
            adjust, interaction, hold, and antidote when on the card.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {drugPreview.map((d) => d.replace(/-/g, " ")).join(", ")}
            …
          </p>
          <Link
            href={`${ROUTES.drugs300}?exam=naplex`}
            className="mt-3 inline-block text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            Open Top 509 (NAPLEX filter) →
          </Link>
        </div>
      </div>
    </section>
  );
}
