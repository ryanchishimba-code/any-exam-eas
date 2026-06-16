/**
 * Cross-exam topic slug aliases — maps board-specific subject IDs to shared anatomy tags.
 * Keeps structure `practiceTopicSlug` stable while PANCE/NCCPA uses different names.
 */
export const TOPIC_SLUG_ALIASES: Record<string, string[]> = {
  pulmonary: ["respiratory"],
  respiratory: ["pulmonary"],
  renal: ["renal-electrolytes", "nephrology", "genitourinary"],
  "renal-electrolytes": ["renal", "nephrology"],
  nephrology: ["renal", "renal-electrolytes"],
  genitourinary: ["renal", "renal-electrolytes"],
  cardiovascular: ["cardiology", "cardiovascular-rx"],
  cardiology: ["cardiovascular", "cardiovascular-rx"],
  "cardiovascular-rx": ["cardiovascular", "cardiology"],
  neurologic: ["neurology-stroke", "neurology", "anatomy"],
  "neurology-stroke": ["neurologic", "neurology"],
  neurology: ["neurologic", "neurology-stroke"],
  gastrointestinal: ["gastroenterology", "gi"],
  gastroenterology: ["gastrointestinal"],
  endocrine: ["endocrine-rx", "endocrine-dm", "endocrinology"],
  "endocrine-rx": ["endocrine", "endocrine-dm"],
  "infectious-diseases": ["infectious-disease", "internal-medicine", "infectious-disease-rx"],
  "infectious-disease": ["infectious-diseases", "internal-medicine"],
  "infectious-disease-rx": ["infectious-diseases", "infectious-disease"],
  "internal-medicine": ["infectious-disease", "infectious-diseases"],
  "physiological-adaptation": ["sepsis-shock", "critical-care", "sepsis"],
  "sepsis-shock": ["physiological-adaptation", "sepsis", "shock"],
  sepsis: ["sepsis-shock", "physiological-adaptation"],
  shock: ["sepsis-shock", "physiological-adaptation"],
  "acute-coronary-syndrome": ["cardiovascular", "cardiology", "acs"],
  acs: ["acute-coronary-syndrome", "cardiovascular", "cardiology"],
  "heart-failure-gdmt": ["cardiovascular", "cardiovascular-rx", "heart-failure"],
  "heart-failure": ["heart-failure-gdmt", "cardiovascular"],
};

export function expandTopicSlugAliases(topicKey: string): Set<string> {
  const normalized = topicKey.trim().toLowerCase().replace(/^(tag|subject):/, "");
  const expanded = new Set<string>([normalized]);
  const queue = [normalized];

  while (queue.length > 0) {
    const slug = queue.pop()!;
    for (const alias of TOPIC_SLUG_ALIASES[slug] ?? []) {
      if (!expanded.has(alias)) {
        expanded.add(alias);
        queue.push(alias);
      }
    }
  }

  return expanded;
}
