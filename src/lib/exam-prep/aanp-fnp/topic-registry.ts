import type { HighYieldTopic } from "@/types/edtech";
import type { AanpFnpClinicalSystemId, AanpFnpDomainId } from "./types";
import {
  AANP_FNP_CROSS_CUTTING_TOPICS,
  aanpFnpSystemModuleSlug,
  allAanpFnp2026TopicSlugs,
  highYieldTopicsForSystem,
  listAanpFnp2026TopicsForSystem,
} from "./blueprint-topics-2026";

export type AanpFnpTopicMeta = {
  blueprintTopicSlugs?: string[];
  blueprintDomain?: AanpFnpDomainId;
  clinicalSystem?: AanpFnpClinicalSystemId;
  lifespanBand?: "pediatrics" | "geriatrics";
};

const DOMAIN_SLUGS: Record<AanpFnpDomainId, string> = {
  assess: "aanp-assess-domain",
  diagnose: "aanp-diagnose-domain",
  plan: "aanp-plan-domain",
  evaluate: "aanp-evaluate-domain",
};

const DOMAIN_BY_SLUG = Object.fromEntries(
  Object.entries(DOMAIN_SLUGS).map(([domain, slug]) => [slug, domain as AanpFnpDomainId])
) as Record<string, AanpFnpDomainId>;

const LIFESPAN_SLUGS = new Set(["aanp-geriatrics-high-yield", "aanp-pediatrics-high-yield"]);

const EXTRA_REGISTRY: Record<string, AanpFnpTopicMeta> = {
  "sig-code-abbreviations": {
    blueprintTopicSlugs: ["pharmacology-mechanisms-monitoring", "professional-role-scope-ethics"],
    blueprintDomain: "plan",
  },
};

function parseSystemSlug(slug: string): AanpFnpClinicalSystemId | undefined {
  if (!slug.startsWith("aanp-system-")) return undefined;
  return slug.slice("aanp-system-".length) as AanpFnpClinicalSystemId;
}

export function getAanpFnpTopicMeta(slug: string): AanpFnpTopicMeta {
  if (EXTRA_REGISTRY[slug]) return EXTRA_REGISTRY[slug]!;

  const domain = DOMAIN_BY_SLUG[slug];
  if (domain) {
    return {
      blueprintDomain: domain,
      blueprintTopicSlugs: allAanpFnp2026TopicSlugs(),
    };
  }

  if (slug === "aanp-geriatrics-high-yield") {
    return {
      lifespanBand: "geriatrics",
      blueprintTopicSlugs: [
        ...highYieldTopicsForSystem("geriatrics"),
        ...AANP_FNP_CROSS_CUTTING_TOPICS.map((t) => t.slug),
      ],
    };
  }

  if (slug === "aanp-pediatrics-high-yield") {
    return {
      lifespanBand: "pediatrics",
      blueprintTopicSlugs: [
        ...highYieldTopicsForSystem("pediatrics"),
        ...AANP_FNP_CROSS_CUTTING_TOPICS.map((t) => t.slug),
      ],
    };
  }

  const clinicalSystem = parseSystemSlug(slug);
  if (clinicalSystem) {
    return {
      clinicalSystem,
      blueprintTopicSlugs: listAanpFnp2026TopicsForSystem(clinicalSystem).map((t) => t.slug),
    };
  }

  if (allAanpFnp2026TopicSlugs().includes(slug)) {
    return { blueprintTopicSlugs: [slug] };
  }

  return {};
}

export function enrichAanpFnpTopic(topic: HighYieldTopic): HighYieldTopic {
  const meta = getAanpFnpTopicMeta(topic.slug);
  return meta.blueprintTopicSlugs?.length
    ? { ...topic, blueprintTopicSlugs: meta.blueprintTopicSlugs }
    : topic;
}

export function enrichAanpFnpTopics(topics: HighYieldTopic[]): HighYieldTopic[] {
  return topics.map(enrichAanpFnpTopic);
}

export function aanpFnpSystemSlugForClinicalSystem(system: AanpFnpClinicalSystemId): string {
  return aanpFnpSystemModuleSlug(system);
}

export function isAanpFnpLifespanTopicSlug(slug: string): boolean {
  return LIFESPAN_SLUGS.has(slug);
}

export function getAanpFnpTopicMetaForPractice(slug: string): AanpFnpTopicMeta {
  return getAanpFnpTopicMeta(slug);
}
