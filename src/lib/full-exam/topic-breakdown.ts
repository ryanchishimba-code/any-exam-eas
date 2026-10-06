import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { NAPLEX_2026_BLUEPRINT } from "@/lib/exam-prep/naplex/blueprint-quota";
import { resolveOrganSystemId } from "@/lib/exam-prep/usmle/content-spine";
import { organSystemById } from "@/lib/exam-prep/usmle/official-content-model";
import { naplexDomainById } from "@/lib/pharmacy/naplex-outline-2025";
import { getSubjectArea } from "@/lib/subjects/subject-catalog";
import type { FullExamTopicBreakdown } from "@/types/full-exam";

const SUBJECT_FIELDS = [
  "nursing",
  "pharmacy",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

const PLACEHOLDERS = new Set(["", "general", "__mixed__", "mixed", "unknown"]);

type TopicQuestion = {
  topicCategory?: string;
  subjectId?: string;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
};

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholder(value: string): boolean {
  return PLACEHOLDERS.has(value.toLowerCase());
}

function displayLabel(raw: string): string {
  return raw
    .split(/[-_/\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function subjectLabel(id: string): string | null {
  if (!id || isPlaceholder(id)) return null;
  for (const fieldId of SUBJECT_FIELDS) {
    const area = getSubjectArea(fieldId, id);
    if (area?.label) return area.label;
  }
  return null;
}

function naplexAreaLabel(domain: string): string | null {
  if (!domain) return null;
  const current = NAPLEX_2026_BLUEPRINT.categories.find((category) => category.id === domain);
  if (current?.label) return current.label;
  return naplexDomainById(domain)?.label ?? null;
}

function humanTopic(value: string): string | null {
  if (!value || isPlaceholder(value)) return null;
  if (/\s/.test(value) && value.length <= 80) return value;
  return null;
}

function bucketForQuestion(q: TopicQuestion): string {
  const subject = clean(q.subjectId);
  const category = clean(q.topicCategory);
  const domain = clean(q.blueprintDomain);
  const topic = clean(q.blueprintTopic);

  const fromSubject = subjectLabel(subject) ?? subjectLabel(category) ?? subjectLabel(topic);
  if (fromSubject) return fromSubject;

  const fromDomain = naplexAreaLabel(domain);
  if (fromDomain) return fromDomain;

  const spine = resolveOrganSystemId(domain, topic || category, subject);
  if (spine) return organSystemById(spine)?.shortLabel ?? spine;

  const written = humanTopic(category) ?? humanTopic(topic);
  if (written) return written;

  const raw = [category, topic, subject, domain].find((value) => value && !isPlaceholder(value));
  if (!raw) return "General";
  return displayLabel(raw);
}

export function buildTopicBreakdown(
  questions: TopicQuestion[],
  answers: ExamAnswerRecord[]
): FullExamTopicBreakdown[] {
  const byTopic = new Map<string, { correct: number; total: number }>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const topic = bucketForQuestion(q ?? {});
    const entry = byTopic.get(topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    const ans = answers.find((a) => a.questionIndex === i);
    if (ans?.correct) entry.correct += 1;
    byTopic.set(topic, entry);
  }

  return [...byTopic.entries()]
    .map(([topic, { correct, total }]) => ({
      topic,
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct || a.topic.localeCompare(b.topic));
}
