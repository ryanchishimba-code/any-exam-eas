import { NextResponse } from "next/server";
import { requirePremiumApi } from "@/lib/api-access";
import {
  composeNaplexPracticeExam,
  type ComposeOutputFormat,
} from "@/lib/exam-prep/naplex/compose-practice-exam";
import type { DifficultyPreference } from "@/lib/exam-prep/naplex/blueprint-selection";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 250;
const VALID_FORMATS: ComposeOutputFormat[] = [
  "ids_only",
  "full_exam_study",
  "full_exam_proctored",
  "json",
];
const VALID_DIFFICULTY: DifficultyPreference[] = ["balanced", "easier", "harder"];

type ComposeBody = {
  numQuestions?: unknown;
  num_questions?: unknown;
  focusAreas?: unknown;
  focus_areas?: unknown;
  difficultyPreference?: unknown;
  difficulty_preference?: unknown;
  outputFormat?: unknown;
  output_format?: unknown;
  seed?: unknown;
};

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return arr.length ? arr : undefined;
}

/**
 * POST /api/exams/naplex/compose
 * Body: { numQuestions, focusAreas?, difficultyPreference?, outputFormat?, seed? }
 * Returns a curated + anti-cluster-sequenced NAPLEX exam with analytics.
 */
export async function POST(req: Request) {
  const premium = await requirePremiumApi(req);
  if (!premium.ok) return premium.response;

  let body: ComposeBody = {};
  try {
    body = (await req.json()) as ComposeBody;
  } catch {
    body = {};
  }

  const rawCount = body.numQuestions ?? body.num_questions ?? 100;
  const numQuestions = Number(rawCount);
  if (!Number.isFinite(numQuestions) || numQuestions < MIN_QUESTIONS || numQuestions > MAX_QUESTIONS) {
    return NextResponse.json(
      { error: `numQuestions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}.` },
      { status: 400 }
    );
  }

  const outputFormatRaw = (body.outputFormat ?? body.output_format ?? "full_exam_study") as string;
  const outputFormat = VALID_FORMATS.includes(outputFormatRaw as ComposeOutputFormat)
    ? (outputFormatRaw as ComposeOutputFormat)
    : "full_exam_study";

  const difficultyRaw = (body.difficultyPreference ?? body.difficulty_preference) as string | undefined;
  const difficultyPreference =
    difficultyRaw && VALID_DIFFICULTY.includes(difficultyRaw as DifficultyPreference)
      ? (difficultyRaw as DifficultyPreference)
      : undefined;

  const focusAreas = asStringArray(body.focusAreas ?? body.focus_areas);
  const seed = Number.isFinite(Number(body.seed)) ? Number(body.seed) : undefined;

  try {
    const exam = await composeNaplexPracticeExam({
      numQuestions: Math.floor(numQuestions),
      focusAreas,
      difficultyPreference,
      outputFormat,
      seed,
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.error("[api/exams/naplex/compose] failed:", error);
    return NextResponse.json(
      { error: "Failed to compose NAPLEX exam." },
      { status: 500 }
    );
  }
}
