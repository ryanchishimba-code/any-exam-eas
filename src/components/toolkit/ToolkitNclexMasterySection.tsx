import Link from "next/link";
import {
  NCLEX_OFFICIAL_LINKS,
  NCLEX_OFFICIAL_LINKS_DISCLAIMER,
} from "@/lib/nursing/official-links";
import {
  LAB_TEACHING_DISCLAIMER,
  priorityLabRows,
} from "@/lib/nursing/lab-teaching-ranges";
import { NCLEX_PRIORITY_DRUG_KEYWORDS } from "@/lib/nursing/nclex-priority-drugs";
import { ROUTES } from "@/lib/routes";

/** Toolkit NCLEX section — official links, teaching labs, priority drugs. */
export function ToolkitNclexMasterySection() {
  const labs = priorityLabRows();
  const drugPreview = NCLEX_PRIORITY_DRUG_KEYWORDS.slice(0, 18);

  return (
    <section className="mx-auto mt-16 max-w-6xl px-6" aria-labelledby="toolkit-nclex-mastery">
      <h2
        id="toolkit-nclex-mastery"
        className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]"
      >
        NCLEX Mastery toolkit
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Official NCSBN plans, teaching lab ranges, and high-yield drug families for
        Today&apos;s Skill Cell loop.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Official links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NCLEX_OFFICIAL_LINKS.map((link) => (
              <li key={link.href}>
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
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            {NCLEX_OFFICIAL_LINKS_DISCLAIMER}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Teaching labs</h3>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">{LAB_TEACHING_DISCLAIMER}</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
            {labs.map((lab) => (
              <li key={lab.id}>
                <span className="font-medium text-[var(--color-ink)]">{lab.name}</span>
                {" — "}
                {lab.teachingRange}
                {lab.unit ? ` ${lab.unit}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Priority drugs</h3>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
            Filtered against the Top 509 catalog for NCLEX Today overweight.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {drugPreview.map((d) => d.replace(/-/g, " ")).join(", ")}
            …
          </p>
          <Link
            href={`${ROUTES.drugs300}?exam=nclex`}
            className="mt-3 inline-block text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            Open Top 509 →
          </Link>
        </div>
      </div>
    </section>
  );
}
