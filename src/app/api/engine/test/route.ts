import { NextResponse } from "next/server";
import { z } from "zod";
import { gatherStudyMaterial } from "@/lib/research";
import { generateExam } from "@/lib/ai";
import { buildScopedTopic, getFieldSubject } from "@/lib/field-subjects";
import { requirePremiumApi } from "@/lib/api-access";
import { enforceRateLimit, enforceUserRateLimit } from "@/lib/api-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 180;

const bodySchema = z.object({
  field: z.string().min(1),
  subjectId: z.string().min(1),
  topic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  questionCount: z.number().int().min(1).max(10).default(3),
});

/**
 * Testing workflow — generates questions with full QC report without persisting to DB.
 * Staff or authenticated users can validate engine accuracy/realism.
 */
export async function POST(req: Request) {
  const ipLimited = enforceRateLimit(req, "engine-test", 20, 60_000);
  if (ipLimited) return ipLimited;

  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  const userLimited = enforceUserRateLimit(auth.userId, "engine-test", 4, 60_000);
  if (userLimited) return userLimited;

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.errors[0]?.message : "Invalid body";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const subject = getFieldSubject(body.field, body.subjectId);
  if (!subject) {
    return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
  }

  const resolvedTopic = buildScopedTopic(body.field, body.subjectId, body.topic?.trim());
  const started = Date.now();

  const material = await gatherStudyMaterial(body.field, resolvedTopic, body.subjectId);

  const exam = await generateExam({
    field: body.field,
    topic: resolvedTopic,
    subjectId: body.subjectId,
    difficulty: body.difficulty,
    questionCount: body.questionCount,
    sources: material.sources,
    researchBrief: material.researchBrief,
    advancedContext: material.advanced,
    mode: "test",
  });

  return NextResponse.json({
    mode: "test",
    durationMs: Date.now() - started,
    subject: { id: subject.id, label: subject.label },
    exam: {
      title: exam.title,
      questions: exam.questions,
      studyNotes: exam.studyNotes,
    },
    qualityReport: exam.qualityReport,
    patternProfile: material.advanced?.patternProfile,
    retrievalMeta: material.advanced?.retrievalMeta,
    expandedQueries: material.advanced?.expandedQueries?.slice(0, 8),
    sourceCounts: material.sourceCounts,
  });
}
