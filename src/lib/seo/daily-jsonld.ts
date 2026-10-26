import type { QotdItem } from "@/lib/demo/qotd-public";
import {
  DAILY_HERO_HEADLINE,
  DAILY_PAGE_DESCRIPTION,
  DAILY_PAGE_TITLE,
  dailyExamTitle,
} from "@/lib/marketing/daily-copy";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

/** Practice-problem question. The same text is rendered in the page HTML. */
export function buildDailyQuizQuestion(item: QotdItem) {
  return {
    "@type": "Question" as const,
    eduQuestionType: "Multiple choice",
    learningResourceType: "Practice problem",
    text: item.stem,
    encodingFormat: "text/plain",
    suggestedAnswer: item.options.map((text, position) => ({
      "@type": "Answer" as const,
      position,
      text,
      encodingFormat: "text/plain",
    })),
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: item.correct,
      encodingFormat: "text/plain",
      comment: {
        "@type": "Comment" as const,
        text: item.rationale,
      },
    },
  };
}

export function buildDailyHubJsonLd(items: readonly QotdItem[], dateModified: string) {
  const url = absoluteUrl("/daily");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: DAILY_PAGE_TITLE,
        description: DAILY_PAGE_DESCRIPTION,
        dateModified,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: getSiteUrl() },
        mainEntity: { "@id": `${url}#quiz` },
      },
      {
        "@type": "Quiz",
        "@id": `${url}#quiz`,
        name: DAILY_HERO_HEADLINE,
        url,
        hasPart: items.map(buildDailyQuizQuestion),
      },
    ],
  };
}

export function buildDailyExamJsonLd(item: QotdItem, dateModified: string) {
  const url = absoluteUrl(`/daily/${item.examSlug}`);
  const name = dailyExamTitle(item.examLabel);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        dateModified,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: getSiteUrl() },
        mainEntity: { "@id": `${url}#quiz` },
      },
      {
        "@type": "Quiz",
        "@id": `${url}#quiz`,
        name,
        url,
        about: { "@type": "Thing", name: item.examLabel },
        hasPart: [buildDailyQuizQuestion(item)],
      },
    ],
  };
}
