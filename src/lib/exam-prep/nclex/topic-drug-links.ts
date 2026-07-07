import { TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import { getDrugClassMeta, type DrugClassId } from "@/lib/drugs300/drug-classes";
import { drugs300ClassHref, drugs300DrugHref } from "@/lib/edtech/practice-links";
import {
  getNclexStudyPreset,
  nclexPresetPracticeHref,
} from "@/lib/exam-prep/nclex/study-presets";
import type { HighYieldTopic } from "@/types/edtech";

export type TopicDrugLink = {
  id: string;
  label: string;
  href: string;
};

export type TopicDrugClassLink = {
  classId: Exclude<DrugClassId, "all">;
  label: string;
  href: string;
};

export type TopicPresetLink = {
  id: string;
  label: string;
  href: string;
};

/** Resolve a registry slug to a Top 500 drug id (exact id or generic match). */
export function resolveTop500DrugId(slug: string): string | undefined {
  const normalized = slug.toLowerCase().trim();
  const exact = TOP_500_DRUGS.find((d) => d.id === normalized);
  if (exact) return exact.id;
  const generic = TOP_500_DRUGS.find((d) =>
    d.generic.toLowerCase().replace(/\s+/g, "-").includes(normalized)
  );
  return generic?.id;
}

export function buildTopicDrugLinks(topic: HighYieldTopic): TopicDrugLink[] {
  return (topic.top500DrugSlugs ?? [])
    .map((slug) => {
      const id = resolveTop500DrugId(slug);
      if (!id) return null;
      const drug = TOP_500_DRUGS.find((d) => d.id === id);
      if (!drug) return null;
      return { id, label: drug.generic, href: drugs300DrugHref(id) };
    })
    .filter((x): x is TopicDrugLink => x != null)
    .slice(0, 8);
}

export function buildTopicDrugClassLinks(topic: HighYieldTopic): TopicDrugClassLink[] {
  return (topic.relatedDrugClasses ?? []).map((classId) => {
    const meta = getDrugClassMeta(classId);
    return {
      classId,
      label: meta.label,
      href: drugs300ClassHref(classId),
    };
  });
}

export function buildTopicPresetLinks(
  examSlug: HighYieldTopic["examSlug"],
  topic: HighYieldTopic
): TopicPresetLink[] {
  if (examSlug !== "nclex") return [];
  return (topic.relatedPresetIds ?? [])
    .map((id) => {
      const preset = getNclexStudyPreset(id);
      if (!preset) return null;
      return {
        id,
        label: preset.title,
        href: nclexPresetPracticeHref(examSlug, preset),
      };
    })
    .filter((x): x is TopicPresetLink => x != null);
}
