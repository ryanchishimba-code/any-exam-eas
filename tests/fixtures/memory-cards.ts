import type { MemoryCard } from "@/lib/reference/types";

export const sampleMemoryCard: MemoryCard = {
  id: "test-naplex-hf",
  examSlug: "naplex",
  subject: "Cardiology",
  topic: "Heart Failure",
  title: "HFrEF Four Pillars (GDMT)",
  teaser: "Mortality-reducing drug classes every pharmacist must know.",
  kind: "table",
  tags: ["GDMT", "HFrEF"],
  body: "Start low, go slow. Diuretics treat congestion but are not a mortality pillar.",
  table: {
    headers: ["Pillar", "Examples"],
    rows: [
      ["RAAS inhibitor", "ACEi / ARB / ARNI"],
      ["Beta-blocker", "Carvedilol, metoprolol succinate"],
    ],
  },
  practiceTopicSlug: "cardiovascular-rx",
  reviewModuleSlug: "heart-failure-gdmt",
  sortOrder: 1,
};
