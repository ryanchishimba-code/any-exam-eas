import { BookOpen, Brain, Globe, Layers, GraduationCap, LineChart } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Deep OER + web research",
    desc: "Scans OpenStax, LibreTexts, Wikibooks, and the web — then builds high-yield questions.",
  },
  {
    icon: Brain,
    title: "Any field",
    desc: "Medicine, engineering, nursing, pharmacy, K–12 — structured by subject, not generic AI fluff.",
  },
  {
    icon: Layers,
    title: "Learning quilt",
    desc: "Interlocking flashcards and quiz tiles. Flashcards, quizzes, or a mixed path.",
  },
  {
    icon: GraduationCap,
    title: "Lesson plans",
    desc: "Structured plans from kindergarten through professional programs.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    desc: "Your account remembers exams, quilts, and completion in one calm dashboard.",
  },
  {
    icon: BookOpen,
    title: "Study modes",
    desc: "Tiles flip, quizzes challenge, and your path adapts to how you learn best.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-[var(--color-surface)] py-[clamp(4rem,10vw,7rem)]">
      <div className="mx-auto max-w-[980px] px-6">
        <p className="apple-eyebrow text-center">Designed for focus</p>
        <h2 className="apple-headline mt-3 text-center">Built for how you actually study.</h2>
        <p className="apple-lede mx-auto mt-5 text-center">
          Spacious layout, subtle motion, and zero clutter — the same quiet confidence you
          expect from the best tools on your desk.
        </p>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="apple-card apple-card-hover p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
                <f.icon className="text-[var(--color-accent)]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
