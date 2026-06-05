import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getExamHub, type ExamSlug } from "@/lib/exams/catalog";
import { PrepHubTabs } from "@/components/prep/PrepHubTabs";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { asc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { examTopics } from "@/db/schema";
import { blueprintTopicsForExam } from "@/lib/exam-topics/seed-data";
import { createId } from "@/lib/id";

const SLUGS = new Set(["nclex", "usmle", "naplex", "top500"]);

async function ensureTopics(examType: ExamSlug) {
  try {
    const db = requireDb();
    const existing = await db
      .select({ id: examTopics.id })
      .from(examTopics)
      .where(eq(examTopics.examType, examType))
      .limit(1);
    if (existing.length > 0) {
      return db
        .select()
        .from(examTopics)
        .where(eq(examTopics.examType, examType))
        .orderBy(asc(examTopics.sortOrder));
    }
    const seeds = blueprintTopicsForExam(examType);
    const now = new Date();
    for (const t of seeds) {
      await db.insert(examTopics).values({
        id: createId(),
        examType,
        slug: t.slug,
        label: t.label,
        description: t.description,
        sortOrder: t.sortOrder,
        createdAt: now,
      });
    }
    return db
      .select()
      .from(examTopics)
      .where(eq(examTopics.examType, examType))
      .orderBy(asc(examTopics.sortOrder));
  } catch {
    return blueprintTopicsForExam(examType).map((t) => ({
      slug: t.slug,
      label: t.label,
      description: t.description ?? null,
    }));
  }
}

export default async function PrepExamPage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam: slug } = await params;
  if (!SLUGS.has(slug)) notFound();

  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/prep/${slug}`);

  await requirePremiumPage(`/prep/${slug}`);

  const exam = getExamHub(slug as ExamSlug)!;
  const topics = await ensureTopics(slug as ExamSlug);
  const Icon = exam.icon;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-[var(--page-top)]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--color-accent)]/10 p-3 text-[var(--color-accent)]">
            <Icon className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Exam hub
            </p>
            <h1 className="apple-display text-3xl">{exam.title}</h1>
          </div>
        </div>
        <p className="mt-3 text-slate-600">{exam.subtitle}</p>
        <PrepHubTabs exam={exam} topics={topics} />
      </div>
    </div>
  );
}
