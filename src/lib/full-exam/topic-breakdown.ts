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
  question?: string | null;
  tags?: string[] | null;
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

const BROAD_NURSING_LABEL =
  /^(medical-surgical nursing|pediatric nursing|maternal & child health|nursing fundamentals|fundamentals|general)$/i;

const PSYCH_ITEM =
  /\b(depressi(?:on|ve)|suicid|self[-\s]?harm|psychosocial|mental health|therapeutic communication|therapeutic response|bipolar|schizophreni|grief|hopeless)\b/i;

function bucketForQuestion(q: TopicQuestion): string {
  const subject = clean(q.subjectId);
  const category = clean(q.topicCategory);
  const domain = clean(q.blueprintDomain);
  const topic = clean(q.blueprintTopic);

  let base = "General";
  const fromSubject = subjectLabel(subject) ?? subjectLabel(category) ?? subjectLabel(topic);
  if (fromSubject) base = fromSubject;
  else {
    const fromDomain = naplexAreaLabel(domain);
    if (fromDomain) base = fromDomain;
    else {
      const spine = resolveOrganSystemId(domain, topic || category, subject);
      if (spine) base = organSystemById(spine)?.shortLabel ?? spine;
      else {
        const written = humanTopic(category) ?? humanTopic(topic);
        if (written) base = written;
        else {
          const raw = [category, topic, subject, domain].find((value) => value && !isPlaceholder(value));
          if (raw) base = displayLabel(raw);
        }
      }
    }
  }

  if (/psychosocial/i.test(base)) return base;
  const haystack = [q.question, topic, category, subject, ...(q.tags ?? [])].filter(Boolean).join(" ");
  const broad = BROAD_NURSING_LABEL.test(base) || base === "General";
  if (PSYCH_ITEM.test(haystack) && (broad || /\b(depressi|suicid|therapeutic (?:response|communication)|psychosocial|mental health)\b/i.test(haystack))) {
    return "Psychosocial Integrity";
  }
  return pharmacyBucketFromText(q, base) ?? base;
}

const PHARMACY_SUBJECT =
  /pharmacotherapy|pharmacy calculations|infectious disease|endocrine|cns & psychiatric|patient counseling|general pharmacology|pharmaceutics|pharmacokinetics|compounding|self-care|pharmacy law|drug information/i;

const CALC_STEM =
  /\b(calculate|alligation|\bauc\b|how many (?:ml|milligrams|milliliters|grams|tablets|capsules)|round to(?: the)?(?: nearest)?|infusion pump|mL\/hr|percent strength|isotonicity|e-value|w\/v|w\/w|how many ml)\b/i;

const TEXT_BUCKETS: { label: string; re: RegExp }[] = [
  {
    label: "Cardiovascular Pharmacotherapy",
    re: /\b(statin|atorvastatin|ldl|hdl|heart failure|myocardial|atrial fibrillation|warfarin|hypertension|ace inhibitor|lisinopril|amlodipine|furosemide|metoprolol|carvedilol|losartan|angina|atheroscl|apixaban|rivaroxaban|clopidogrel|digoxin|spironolactone|sacubitril|lipid)\b/i,
  },
  {
    label: "Infectious Disease Therapy",
    re: /\b(antibiotic|vancomycin|c\.?\s*diff|clostridioides|sepsis|pneumonia|mrsa|antimicrobial)\b/i,
  },
  {
    label: "Endocrine Pharmacotherapy",
    re: /\b(insulin|metformin|diabetic ketoacidosis|\bdka\b|levothyroxine|hba1c|thyroid)\b/i,
  },
  {
    label: "CNS & Psychiatric Medications",
    re: /\b(ssri|sertraline|fluoxetine|antipsychotic|depression)\b/i,
  },
];

/**
 * Stored subject labels win when the stem is silent. A calculations label on a
 * statin stem, or a cardiovascular label on an alligation stem, follows the text.
 */
function pharmacyBucketFromText(q: TopicQuestion, base: string): string | null {
  const text = clean(q.question);
  if (!text) return null;
  const subject = clean(q.subjectId);
  const pharmacy =
    PHARMACY_SUBJECT.test(base) ||
    subject === "compounding-calculations" ||
    subject.endsWith("-rx");
  if (!pharmacy) return null;
  if (CALC_STEM.test(text)) return "Pharmacy Calculations";
  const matched = TEXT_BUCKETS.find((bucket) => bucket.re.test(text));
  if (matched && matched.label !== base) return matched.label;
  if (/calculation/i.test(base) && !matched) return "General Pharmacology";
  return null;
}

export function buildTopicBreakdown(
  questions: TopicQuestion[],
  answers: ExamAnswerRecord[]
): FullExamTopicBreakdown[] {
  const byTopic = new Map<string, { correct: number; total: number; unanswered: number }>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const topic = bucketForQuestion(q ?? {});
    const entry = byTopic.get(topic) ?? { correct: 0, total: 0, unanswered: 0 };
    const ans = answers.find((a) => a.questionIndex === i);
    const selected = typeof ans?.selected === "string" ? ans.selected.trim() : "";
    if (!selected) {
      entry.unanswered += 1;
    } else {
      entry.total += 1;
      if (ans?.correct) entry.correct += 1;
    }
    byTopic.set(topic, entry);
  }

  return [...byTopic.entries()]
    .map(([topic, { correct, total, unanswered }]) => ({
      topic,
      correct,
      total,
      ...(unanswered > 0 ? { unanswered } : {}),
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .filter((row) => row.total > 0 || (row.unanswered ?? 0) > 0)
    .sort((a, b) => a.pct - b.pct || a.topic.localeCompare(b.topic));
}
