import type { ReviewModuleContent, ReviewModuleTable } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

type UsmleModuleInput = {
  why: string[];
  concepts: string[];
  clinical: string[];
  tables?: ReviewModuleTable[];
  visual: string[];
  misconceptions: string[];
  pearls: string[];
  summary: string[];
};

/** Builds an 8-section USMLE textbook-style review module (lecture-replacement depth). */
export function buildUsmleReviewModule(input: UsmleModuleInput): ReviewModuleContent {
  return {
    sections: [
      { id: "why-it-matters", title: T["why-it-matters"], paragraphs: input.why },
      { id: "core-concepts", title: T["core-concepts"], bullets: input.concepts },
      { id: "clinical-applications", title: T["clinical-applications"], bullets: input.clinical },
      {
        id: "comparisons",
        title: T.comparisons,
        tables: input.tables ?? [],
        bullets: input.tables?.length ? undefined : ["See core concepts for decision frameworks."],
      },
      { id: "visual-aids", title: T["visual-aids"], bullets: input.visual },
      { id: "misconceptions", title: T.misconceptions, bullets: input.misconceptions },
      { id: "pearls", title: T.pearls, bullets: input.pearls },
      { id: "quick-summary", title: T["quick-summary"], bullets: input.summary },
    ],
  };
}
