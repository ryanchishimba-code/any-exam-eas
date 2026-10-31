import fs from "node:fs";
import path from "node:path";
import { isPanceFeedCardId, shortSystemName } from "@/lib/pance-feed/format";

/**
 * Server-only catalog. Reads every cards-*.json under content/pance-feed/cards
 * so a later batch is picked up by dropping files in, with no code change.
 * Do not import this module from a client component.
 */

const CARD_FILE = /^cards-.+\.json$/;
const DEFAULT_ROOT = path.join(process.cwd(), "content", "pance-feed");

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

let cache: Cache | null = null;

export function resetPanceFeedCardCache(): void {
  cache = null;
}

export function loadPanceFeedCards(root = DEFAULT_ROOT): PanceFeedCard[] {
  if (cache?.root === root) return cache.cards;
  const dir = path.join(root, "cards");
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
      const card = normalizeCard(row);
      if (!card || seen.has(card.id)) continue;
      seen.add(card.id);
      cards.push(card);
    }
  }
  cards.sort((a, b) => cardNumber(a.id) - cardNumber(b.id));
  cache = { root, cards, byId: new Map(cards.map((card) => [card.id, card])) };
  return cards;
}

export function getPanceFeedCard(id: string, root = DEFAULT_ROOT): PanceFeedCard | null {
  loadPanceFeedCards(root);
  return cache?.root === root ? (cache.byId.get(id) ?? null) : null;
}

export function loadPanceFeedSvg(id: string, root = DEFAULT_ROOT): string | null {
  if (!isPanceFeedCardId(id) || !getPanceFeedCard(id, root)) return null;
  const file = path.join(root, "svg", `${id}.svg`);
  if (!fs.existsSync(file)) return null;
  const svg = fs.readFileSync(file, "utf8");
  if (/<script|javascript:|on\w+=/i.test(svg)) return null;
  return svg.replace(/\sclass="v3"/, "");
}

function cardNumber(id: string): number {
  return Number(id.replace(/\D/g, "")) || 0;
}

function normalizeCard(row: unknown): PanceFeedCard | null {
  if (!row || typeof row !== "object") return null;
  const card = row as Record<string, unknown>;
  const id = typeof card.id === "string" ? card.id : "";
  if (!isPanceFeedCardId(id)) return null;
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
