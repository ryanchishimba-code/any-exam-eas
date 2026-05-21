import { mergeOerDomains } from "./oer";
import { getFieldMeta } from "./fields";
import { getFieldSubject } from "./field-subjects";

export type SearchResult = {
  title: string;
  url: string;
  content: string;
  sourceType: "oer" | "web" | "exam_focus" | "curriculum";
};

export type SearchOptions = {
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  sourceType?: SearchResult["sourceType"];
};

export async function searchWeb(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  const maxResults = options.maxResults ?? 6;
  const sourceType = options.sourceType ?? "web";

  if (!apiKey) {
    return fallbackResults(query, sourceType);
  }

  const body: Record<string, unknown> = {
    api_key: apiKey,
    query,
    search_depth: "advanced",
    max_results: maxResults,
    include_answer: true,
    include_raw_content: false,
  };

  if (options.includeDomains?.length) {
    body.include_domains = options.includeDomains.slice(0, 20);
  }
  if (options.excludeDomains?.length) {
    body.exclude_domains = options.excludeDomains;
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Web search failed");
  }

  const data = (await res.json()) as {
    results?: Array<{ title: string; url: string; content: string }>;
    answer?: string;
  };

  const results = (data.results ?? []).map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    sourceType,
  }));

  if (data.answer && results.length > 0) {
    results[0] = {
      ...results[0],
      content: `${data.answer}\n\n${results[0].content}`,
    };
  }

  return results;
}

function fallbackResults(query: string, sourceType: SearchResult["sourceType"]): SearchResult[] {
  return [
    {
      title: `OpenStax / LibreTexts — ${query.slice(0, 80)}`,
      url: "https://openstax.org",
      content: `Study context for: ${query}. Using built-in high-yield question bank; add TAVILY_API_KEY for live OER and web search.`,
      sourceType,
    },
  ];
}

export function dedupeSources(sources: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return sources.filter((s) => {
    const key = s.url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return s.content.trim().length > 20;
  });
}

export function buildFieldSearchQueries(
  field: string,
  topic: string,
  subjectId?: string
): Array<{ query: string; options: SearchOptions }> {
  const meta = getFieldMeta(field);
  const subject = subjectId ? getFieldSubject(field, subjectId) : undefined;
  const oerDomains = mergeOerDomains(meta?.oerDomains ?? []);
  const scope = subject?.label ?? topic;
  const textbooks = subject?.textbookRefs ?? "OpenStax LibreTexts";
  const hints = subject?.examHints ?? meta?.examFocus ?? "commonly tested material";

  return [
    {
      query: `${scope} ${textbooks} textbook chapter practice problems`,
      options: { includeDomains: oerDomains, maxResults: 6, sourceType: "oer" },
    },
    {
      query: `${scope} ${field} open educational resource ${textbooks}`,
      options: { includeDomains: oerDomains, maxResults: 5, sourceType: "oer" },
    },
    {
      query: `${scope} wikibooks study guide ${field}`,
      options: { maxResults: 4, sourceType: "oer" },
    },
    {
      query: `${scope} ${field} exam questions quiz ${hints}`,
      options: { maxResults: 6, sourceType: "exam_focus" },
    },
    {
      query: `${scope} learning objectives syllabus ${field}`,
      options: { maxResults: 5, sourceType: "curriculum" },
    },
    {
      query: `${scope} ${field} key concepts study guide`,
      options: { maxResults: 6, sourceType: "web" },
    },
    {
      query: `${scope} practice test multiple choice ${field}`,
      options: { maxResults: 5, sourceType: "exam_focus" },
    },
  ];
}
