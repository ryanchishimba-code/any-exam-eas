import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { resolveCitedSources } from "@/lib/assessment/sources";
import type { NgnReference } from "@/lib/assessment/types";

export type HeroBowTieColumn = {
  label: string;
  options: { text: string; keyed: boolean }[];
};

export type HeroNgnFrame = {
  itemId: string;
  stem: string;
  exhibitTitle: string | null;
  exhibitText: string | null;
  columns: HeroBowTieColumn[];
  rationale: string;
  sources: { title: string; locator: string | null }[];
};

type BowGroup = { options?: unknown; keys?: unknown };

function readGroup(raw: unknown, label: string): HeroBowTieColumn | null {
  if (!raw || typeof raw !== "object") return null;
  const group = raw as BowGroup;
  if (!Array.isArray(group.options)) return null;
  const keys = new Set(
    Array.isArray(group.keys)
      ? group.keys.filter((key): key is string => typeof key === "string")
      : []
  );
  const options = group.options.flatMap((option) => {
    if (!option || typeof option !== "object") return [];
    const row = option as { id?: unknown; text?: unknown };
    if (typeof row.id !== "string" || typeof row.text !== "string") return [];
    const text = row.text.trim();
    if (!text) return [];
    return [{ text, keyed: keys.has(row.id) }];
  });
  if (options.length === 0) return null;
  return { label, options };
}

function readExhibit(raw: unknown): { title: string | null; text: string | null } {
  if (!raw || typeof raw !== "object") return { title: null, text: null };
  const row = raw as { title?: unknown; text?: unknown };
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const text = typeof row.text === "string" ? row.text.trim() : "";
  return { title: title || null, text: text || null };
}

function readRationale(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const short = (raw as { short?: unknown }).short;
  if (typeof short !== "string") return null;
  const text = short.trim();
  return text || null;
}

function readReferences(raw: unknown): NgnReference[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as { src?: unknown; locator?: unknown };
    if (typeof row.src !== "string" || !row.src.trim()) return [];
    return [
      {
        src: row.src.trim(),
        locator: typeof row.locator === "string" ? row.locator : undefined,
      },
    ];
  });
}

/** Map a stored NGN bow-tie row into the public hero frame. Returns null if it is incomplete. */
export function toHeroNgnFrame(input: {
  id: string;
  stem: string;
  payload: unknown;
  exhibit: unknown;
  rationale: unknown;
  references: unknown;
  sources: unknown;
}): HeroNgnFrame | null {
  const stem = input.stem.trim();
  if (!stem) return null;
  const payload = input.payload;
  if (!payload || typeof payload !== "object") return null;
  const record = payload as { condition?: unknown; actions?: unknown; monitor?: unknown };
  const columns = [
    readGroup(record.condition, "Condition"),
    readGroup(record.actions, "Actions"),
    readGroup(record.monitor, "Monitor"),
  ].filter((column): column is HeroBowTieColumn => column != null);
  if (columns.length < 3) return null;
  const rationale = readRationale(input.rationale);
  if (!rationale) return null;
  const exhibit = readExhibit(input.exhibit);
  const sources = resolveCitedSources(readReferences(input.references), sourceRegistrySafe(input.sources)).map(
    (source) => ({ title: source.title, locator: source.locator })
  );
  if (sources.length === 0) return null;
  return {
    itemId: input.id,
    stem,
    exhibitTitle: exhibit.title,
    exhibitText: exhibit.text,
    columns,
    rationale,
    sources,
  };
}

function sourceRegistrySafe(sources: unknown) {
  if (!Array.isArray(sources)) return {};
  const out: Record<string, { title: string; url: string }> = {};
  for (const entry of sources) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as { id?: unknown; title?: unknown; url?: unknown };
    if (typeof row.id !== "string" || !row.id) continue;
    out[row.id] = {
      title: typeof row.title === "string" && row.title.trim() ? row.title.trim() : row.id,
      url: typeof row.url === "string" ? row.url : "",
    };
  }
  return out;
}

async function loadHeroNgnFrame(): Promise<HeroNgnFrame | null> {
  try {
    const item = await prisma.ngnItem.findFirst({
      where: { status: "published", responseFormat: "bowtie" },
      orderBy: { id: "asc" },
      include: { batch: { select: { sources: true } } },
    });
    if (!item) return null;
    return toHeroNgnFrame({
      id: item.id,
      stem: item.stem,
      payload: item.payload,
      exhibit: item.exhibit,
      rationale: item.rationale,
      references: item.references,
      sources: item.batch.sources,
    });
  } catch {
    return null;
  }
}

const loadCachedHeroNgnFrame = unstable_cache(loadHeroNgnFrame, ["hero-ngn-bowtie-frame-v1"], {
  revalidate: 3600,
});

/** One published bow-tie for the marketing hero. Null when the bank query fails. */
export async function getHeroNgnFrame(): Promise<HeroNgnFrame | null> {
  return loadCachedHeroNgnFrame();
}
