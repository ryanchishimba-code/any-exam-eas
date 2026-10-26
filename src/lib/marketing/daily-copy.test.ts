import { describe, expect, it } from "vitest";
import { EXAM_SLUGS } from "@/lib/edtech/exams";
import { getQotdForExam, todayIsoCentral } from "@/lib/demo/qotd";
import { buildDailyExamJsonLd, buildDailyHubJsonLd } from "@/lib/seo/daily-jsonld";
import {
  DAILY_HERO_ACCENT,
  DAILY_HERO_HEADLINE,
  DAILY_HERO_LEAD,
  DAILY_PAGE_DESCRIPTION,
  DAILY_PAGE_TITLE,
  dailyExamDescription,
  dailyExamTitle,
} from "@/lib/marketing/daily-copy";

describe("daily seo copy", () => {
  it("keeps one keyword headline and a title and description inside the limits", () => {
    expect(`${DAILY_HERO_LEAD} ${DAILY_HERO_ACCENT}`).toBe(DAILY_HERO_HEADLINE);
    expect(DAILY_HERO_HEADLINE).toBe(
      "Free daily NCLEX, NAPLEX, PANCE, USMLE, FNP, NPTE-PT practice question"
    );
    expect(DAILY_PAGE_TITLE.length).toBeLessThanOrEqual(60);
    expect(DAILY_PAGE_DESCRIPTION.length).toBeLessThanOrEqual(155);
    expect(DAILY_PAGE_DESCRIPTION.length).toBeGreaterThanOrEqual(140);
    expect(DAILY_HERO_HEADLINE.toLowerCase()).not.toMatch(/\bpass\b/);
  });

  it("builds a valid quiz for every live board item and a short exam title", () => {
    const today = todayIsoCentral();
    const items = EXAM_SLUGS.map((slug) => getQotdForExam(slug, today));
    expect(items.every(Boolean)).toBe(true);
    const live = items.flatMap((item) => (item ? [item] : []));
    const hub = JSON.stringify(buildDailyHubJsonLd(live, today));
    expect(hub).toContain('"@type":"WebPage"');
    expect(hub).toContain('"@type":"Quiz"');
    expect(hub).toContain('"eduQuestionType":"Multiple choice"');
    expect(hub).toContain(`"dateModified":"${today}"`);
    expect(hub).not.toContain("QAPage");
    for (const item of live) {
      expect(hub).toContain(item.stem);
      expect(hub).toContain(item.correct);
      expect(hub).toContain(item.rationale);
      const title = dailyExamTitle(item.examLabel);
      const description = dailyExamDescription(item.examLabel, item.stem);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeLessThanOrEqual(155);
      const examLd = JSON.stringify(buildDailyExamJsonLd(item, today));
      expect(examLd).toContain(item.rationale);
      expect(examLd).toContain('"@type":"Quiz"');
    }
  });
});
