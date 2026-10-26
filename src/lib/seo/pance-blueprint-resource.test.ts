import { describe, expect, it } from "vitest";
import { getResourceArticle } from "@/lib/seo/resources-content";

const OFFICIAL_CONTENT = [
  "Cardiovascular (11%)",
  "Pulmonary (9%)",
  "Gastrointestinal / Nutritional (8%)",
  "Musculoskeletal (8%)",
  "Infectious Diseases (7%)",
  "Neurologic (7%)",
  "Psychiatric / Behavioral (7%)",
  "Reproductive (7%)",
  "Endocrine (6%)",
  "Eyes, Ears, Nose & Throat (EENT) (6%)",
  "Professional Practice (6%)",
  "Hematologic (5%)",
  "Renal (5%)",
  "Dermatologic (4%)",
  "Genitourinary (4%)",
];

const OFFICIAL_TASKS = [
  "History Taking and Performing Physical Examination (16%)",
  "Using Diagnostic and Laboratory Studies (10%)",
  "Formulating Most Likely Diagnosis (18%)",
  "Health Maintenance, Patient Education, and Preventive Measures (11%)",
  "Clinical Intervention (16%)",
  "Pharmaceutical Therapeutics (15%)",
  "Applying Basic Scientific Concepts (8%)",
  "Professional Practice (6%)",
];

describe("PANCE NCCPA blueprint resource page", () => {
  const article = getResourceArticle("pance-study-guide-nccpa-blueprint");

  it("keeps the title and meta description", () => {
    expect(article?.title).toBe("PANCE Study Guide — NCCPA Roadmap (2026)");
    expect(article?.metaDescription).toBe(
      "PANCE study guide aligned to the NCCPA task areas and organ-system weights — cardiovascular (11%), treatment tasks, and primary care across the lifespan."
    );
    expect(article?.faq).toBeUndefined();
  });

  it("states the January 2025 NCCPA organ-system and task-area weights", () => {
    expect(article).toBeDefined();
    const weights = article!.sections[0]!;
    expect(weights.heading).toBe(
      "Organ-system and task-area weights (NCCPA blueprint, effective January 2025)"
    );
    const text = (weights.paragraphs ?? []).join(" ");
    for (const line of [...OFFICIAL_CONTENT, ...OFFICIAL_TASKS]) {
      expect(text).toContain(line);
    }
    expect(text).not.toMatch(/Cardiovascular \(13%\)|Pulmonary \(10%\)|EENT\) \(7%\)|Endocrine \(7%\)|Neurologic \(6%\)|Psychiatric \/ Behavioral \(6%\)/);
  });

  it("cites the NCCPA blueprint page and PDF", () => {
    const source = article!.sections.map((section) => (section.paragraphs ?? []).join(" ")).join(" ");
    expect(source).toContain("effective January 2025");
    expect(source).toContain("https://www.nccpa.net/become-certified/pance-blueprint/");
    expect(source).toContain("https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf");
  });
});
