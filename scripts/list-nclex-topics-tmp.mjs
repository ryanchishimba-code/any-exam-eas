#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import { resolveNclexTopicPracticeParams } from "../src/lib/exam-prep/nclex/topic-practice.ts";
import { getNclexTopicMeta } from "../src/lib/exam-prep/nclex/topic-registry.ts";

const topics = getHighYieldTopics("nclex").map((t) => {
  const meta = getNclexTopicMeta(t.slug);
  const p = resolveNclexTopicPracticeParams(t);
  return {
    slug: t.slug,
    title: t.title,
    domain: meta.clientNeedsDomain,
    subjectId: p.subjectId,
    blueprintTopics: p.blueprintTopics ?? [],
    nclexPreset: p.nclexPreset ?? null,
  };
});

writeFileSync("/tmp/nclex-topics-for-cdp.json", JSON.stringify(topics));
console.log("topics", topics.length);
