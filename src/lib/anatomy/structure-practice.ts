import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  practiceTopicHref,
  type TopicPracticeFilters,
} from "@/lib/edtech/practice-links-core";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import {
  topicNodeFromConceptKey,
  topicNodeFromHighYield,
  topicNodeToPracticeFilter,
} from "@/lib/topics/topic-node";
import type { ExamSlug } from "@/types/edtech";

type StructurePracticeInput = {
  id: string;
  name: string;
  practiceTopicSlug: string;
};

/**
 * Anatomy structures use cross-board `practiceTopicSlug` values (e.g. cardiovascular).
 * Map to each board's Study Hub / bank identity before building practice URLs.
 */
const ANATOMY_PRACTICE_TOPIC_ALIASES: Partial<
  Record<ExamSlug, Record<string, string>>
> = {
  nclex: {
    gastrointestinal: "gi-emergencies",
    "renal-electrolytes": "renal",
    renal: "renal",
    "neurology-stroke": "neurologic",
    "endocrine-dm": "diabetes",
    endocrine: "diabetes",
    genitourinary: "renal",
    hematology: "heme-oncology",
    "critical-care": "sepsis-shock",
    anatomy: "med-surg",
  },
  naplex: {
    cardiovascular: "cardiovascular-rx",
    endocrine: "endocrine-rx",
    "endocrine-dm": "endocrine-rx",
    "infectious-diseases": "infectious-disease-rx",
  },
  "npte-pt": {
    cardiovascular: "cardiovascular-pulmonary",
    respiratory: "cardiovascular-pulmonary",
    pulmonary: "cardiovascular-pulmonary",
  },
};

function resolveConceptSlug(examSlug: ExamSlug, practiceTopicSlug: string): string {
  const aliases = ANATOMY_PRACTICE_TOPIC_ALIASES[examSlug];
  return aliases?.[practiceTopicSlug] ?? practiceTopicSlug;
}

export function resolveAnatomyStructurePractice(
  examSlug: ExamSlug,
  practiceTopicSlug: string
): { subjectId: string; filters: TopicPracticeFilters } {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const conceptSlug = resolveConceptSlug(examSlug, practiceTopicSlug);
  const hyCard =
    getHighYieldTopic(examSlug, conceptSlug) ??
    getHighYieldTopic(examSlug, practiceTopicSlug);

  if (hyCard) {
    return topicNodeToPracticeFilter(
      topicNodeFromHighYield(examSlug, hyCard, fieldId)
    );
  }

  return topicNodeToPracticeFilter(
    topicNodeFromConceptKey(examSlug, `subject:${conceptSlug}`, { fieldId })
  );
}

export function structurePracticeHref(
  examSlug: ExamSlug,
  structure: StructurePracticeInput,
  count = 10
): string {
  const { subjectId, filters } = resolveAnatomyStructurePractice(
    examSlug,
    structure.practiceTopicSlug
  );
  const base = practiceTopicHref(examSlug, subjectId, count, undefined, filters);
  const url = new URL(base, "https://anyexameasy.local");
  url.searchParams.set("style", "standard");
  url.searchParams.set("returnExam", examSlug);
  url.searchParams.set("returnStructure", structure.id);
  url.searchParams.set("returnStructureName", structure.name);
  return `${url.pathname}?${url.searchParams.toString()}`;
}
