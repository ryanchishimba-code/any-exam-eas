import fs from "node:fs";
import path from "node:path";
import { isPanceFeedCardId, shortSystemName } from "@/lib/pance-feed/format";
import {
  isStudyFeedCardId,
  STUDY_FEEDS,
  type StudyFeedExam,
} from "@/lib/study-feed/catalog";

/**
 * Server-only catalog. Reads cards.json and every cards-*.json under
 * content/pance-feed/cards, so a later batch is picked up by dropping files
 * in, with no code change. Do not import this module from a client component.
 */

const CARD_FILE = /^cards(?:-.+)?\.json$/;
const DEFAULT_ROOT = path.join(process.cwd(), "content", "pance-feed");

function contentRoot(exam: StudyFeedExam, root?: string): string {
  return root ?? path.join(process.cwd(), "content", STUDY_FEEDS[exam].contentDir);
}

export type PanceFeedCard = {
  id: string;
  system: string;
  front: string;
  bottom: string;
  bullets: { clue: string; treat: string; trap: string };
  source: { guideline: string; year: string };
};

type Cache = {
  root: string;
  cards: PanceFeedCard[];
  byId: Map<string, PanceFeedCard>;
};

const caches = new Map<string, Cache>();

export function resetPanceFeedCardCache(): void {
  caches.clear();
}

export function loadStudyFeedCards(exam: StudyFeedExam, root?: string): PanceFeedCard[] {
  const resolved = contentRoot(exam, root);
  const hit = caches.get(resolved);
  if (hit) return hit.cards;
  const prefix = STUDY_FEEDS[exam].idPrefix;
  const dir = path.join(resolved, "cards");
  const files = fs
    .readdirSync(dir)
    .filter((name) => CARD_FILE.test(name))
    .sort();
  const cards: PanceFeedCard[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as unknown;
    if (!Array.isArray(raw)) continue;
    for (const row of raw) {
      const card = normalizeCard(row, prefix);
      if (!card || seen.has(card.id)) continue;
      seen.add(card.id);
      cards.push(card);
    }
  }
  cards.sort((a, b) => cardNumber(a.id) - cardNumber(b.id));
  caches.set(resolved, { root: resolved, cards, byId: new Map(cards.map((card) => [card.id, card])) });
  return cards;
}

export function loadPanceFeedCards(root = DEFAULT_ROOT): PanceFeedCard[] {
  return loadStudyFeedCards("pance", root);
}

export function getStudyFeedCard(
  exam: StudyFeedExam,
  id: string,
  root?: string
): PanceFeedCard | null {
  const resolved = contentRoot(exam, root);
  loadStudyFeedCards(exam, resolved);
  return caches.get(resolved)?.byId.get(id) ?? null;
}

export function getPanceFeedCard(id: string, root = DEFAULT_ROOT): PanceFeedCard | null {
  return getStudyFeedCard("pance", id, root);
}

export function loadStudyFeedSvg(exam: StudyFeedExam, id: string, root?: string): string | null {
  const prefix = STUDY_FEEDS[exam].idPrefix;
  if (!isStudyFeedCardId(prefix, id) || !getStudyFeedCard(exam, id, root)) return null;
  const file = path.join(contentRoot(exam, root), "svg", `${id}.svg`);
  if (!fs.existsSync(file)) return null;
  const svg = fs.readFileSync(file, "utf8");
  if (/<script|javascript:|on\w+=/i.test(svg)) return null;
  return svg.replace(/\sclass="v3"/, "");
}

export function loadPanceFeedSvg(id: string, root = DEFAULT_ROOT): string | null {
  if (!isPanceFeedCardId(id)) return null;
  return loadStudyFeedSvg("pance", id, root);
}

function cardNumber(id: string): number {
  return Number(id.replace(/\D/g, "")) || 0;
}

function normalizeCard(row: unknown, idPrefix: string): PanceFeedCard | null {
  if (!row || typeof row !== "object") return null;
  const card = row as Record<string, unknown>;
  const id = typeof card.id === "string" ? card.id : "";
  if (!isStudyFeedCardId(idPrefix, id)) return null;
  const bullets = card.bullets;
  const source = card.source;
  if (!bullets || typeof bullets !== "object" || !source || typeof source !== "object") return null;
  const b = bullets as Record<string, unknown>;
  const s = source as Record<string, unknown>;
  if (typeof card.front !== "string" || typeof card.bottom !== "string") return null;
  if (typeof b.clue !== "string" || typeof b.treat !== "string" || typeof b.trap !== "string") {
    return null;
  }
  if (typeof s.guideline !== "string" || typeof s.year !== "string") return null;
  if (typeof card.system !== "string" || !card.system.trim()) return null;
  return {
    id,
    system: shortSystemName(card.system),
    front: card.front,
    bottom: card.bottom,
    bullets: { clue: b.clue, treat: b.treat, trap: b.trap },
    source: { guideline: s.guideline, year: s.year },
  };
}
