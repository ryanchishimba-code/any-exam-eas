import { createRoot } from "react-dom/client";
import { PanceFeed } from "@/components/pance-feed/PanceFeed";
import { STUDY_FEEDS, type StudyFeedExam } from "@/lib/study-feed/catalog";
import type { PanceFeedCard } from "@/lib/pance-feed/load-cards";

type FeedBoot = {
  exam: StudyFeedExam;
  cards: PanceFeedCard[];
  svgs: Record<string, string>;
};

declare global {
  interface Window {
    __FEED__: FeedBoot;
  }
}

const data = window.__FEED__;
const board = STUDY_FEEDS[data.exam];

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (init?.method && init.method !== "GET") {
    return new Response(
      JSON.stringify({ mastered: [], reviewQueue: [], lastSeenCardId: null }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }
  if (url.endsWith("/progress")) {
    return new Response(
      JSON.stringify({ mastered: [], reviewQueue: [], lastSeenCardId: null }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }
  if (url.endsWith("/cards")) {
    return new Response(JSON.stringify({ total: data.cards.length, cards: data.cards }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  const id = url.split("/").pop() ?? "";
  const svg = data.svgs[id];
  return new Response(JSON.stringify({ svg: svg ?? null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

createRoot(document.getElementById("root")!).render(<PanceFeed board={board} />);
