/**
 * Near-duplicate clusters for one sitting.
 * A stored template/family id wins. Otherwise items cluster when the normalized
 * stem and the option set are near copies of each other.
 */
import type { BankItem } from "@/lib/question-bank";
import { normalizeClinicalCaseText } from "@/lib/exam-prep/clinical-case-dedupe";
import { optionChoiceSimilarity } from "@/lib/questions/session-quality";

const FAMILY_META_KEYS = [
  "templateId",
  "templateFamilyId",
  "familyId",
  "stemTemplateId",
  "templateFamily",
] as const;

const STEM_NEAR = 0.72;
const OPTION_NEAR = 0.6;

function signaturesNear(stemSim: number, optionSim: number): boolean {
  if (stemSim >= 0.92) return true;
  return stemSim >= STEM_NEAR && optionSim >= OPTION_NEAR;
}

const TOKEN_STOP = new Set([
  "which",
  "what",
  "when",
  "that",
  "this",
  "with",
  "from",
  "have",
  "been",
  "were",
  "your",
  "their",
  "about",
  "into",
  "after",
  "before",
  "should",
  "would",
  "could",
  "nurse",
  "client",
  "patient",
  "following",
  "most",
  "appropriate",
  "action",
  "take",
  "first",
  "best",
  "response",
  "select",
  "scenario",
  "year",
  "old",
]);

function readMetaId(meta: unknown): string | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const rec = meta as Record<string, unknown>;
  for (const key of FAMILY_META_KEYS) {
    const value = rec[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** Stored family id, when the bank or the generator recorded one. */
export function templateFamilyId(item: BankItem): string | null {
  const cluster = item.clusterId?.trim();
  if (cluster) return `cluster:${cluster}`;

  const fromGeneration = readMetaId(item.generationMeta);
  if (fromGeneration) return `family:${fromGeneration}`;

  const fromCuration = readMetaId(item.curationMeta);
  if (fromCuration) return `family:${fromCuration}`;

  const payload = item.ngnPayload;
  if (payload && typeof payload === "object") {
    const setId = payload.setId;
    if (payload.kind === "sequential" && typeof setId === "string" && setId.trim()) {
      return `seq:${setId.trim()}`;
    }
    const fromPayload = readMetaId(payload);
    if (fromPayload) return `family:${fromPayload}`;
  }

  return null;
}

export function sequentialSetId(item: BankItem): string | null {
  const payload = item.ngnPayload;
  if (!payload || typeof payload !== "object") return null;
  if (payload.kind !== "sequential") return null;
  const setId = payload.setId;
  return typeof setId === "string" && setId.trim() ? setId.trim() : null;
}

export function stemTokens(text: string): string[] {
  const norm = normalizeClinicalCaseText(text);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const token of norm.split(/[^a-z0-9]+/)) {
    if (token.length <= 3 || TOKEN_STOP.has(token) || seen.has(token)) continue;
    seen.add(token);
    out.push(token);
  }
  return out;
}

function tokenJaccard(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const sb = new Set(b);
  let inter = 0;
  for (const token of a) {
    if (sb.has(token)) inter += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union > 0 ? inter / union : 0;
}

function itemStem(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const question = item.question?.trim() ?? "";
  return vignette ? `${vignette} ${question}` : question;
}

/** True when two rows are the same template with light wording or dose edits. */
export function itemsAreNearDuplicates(a: BankItem, b: BankItem): boolean {
  const familyA = templateFamilyId(a);
  const familyB = templateFamilyId(b);
  if (familyA && familyB) return familyA === familyB;
  if (familyA || familyB) return false;

  const stemSim = tokenJaccard(stemTokens(itemStem(a)), stemTokens(itemStem(b)));
  const optionSim = optionChoiceSimilarity(a.options ?? [], b.options ?? []);
  return signaturesNear(stemSim, optionSim);
}

/**
 * One cluster id per pool index. Family ids stay authoritative and are not
 * merged with a different family by wording alone.
 */
export function assignSittingClusters(items: readonly BankItem[]): string[] {
  const parent = items.map((_, index) => index);
  const find = (index: number): number => {
    let root = index;
    while (parent[root] !== root) root = parent[root]!;
    let cursor = index;
    while (parent[cursor] !== root) {
      const next = parent[cursor]!;
      parent[cursor] = root;
      cursor = next;
    }
    return root;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };

  const families = items.map((item) => templateFamilyId(item));
  const byFamily = new Map<string, number>();
  for (let i = 0; i < items.length; i++) {
    const family = families[i];
    if (!family) continue;
    const prior = byFamily.get(family);
    if (prior == null) byFamily.set(family, i);
    else union(prior, i);
  }

  const open: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!families[i]) open.push(i);
  }
  const signatures = open.map((index) => stemTokens(itemStem(items[index]!)));

  for (let a = 0; a < open.length; a++) {
    for (let b = a + 1; b < open.length; b++) {
      if (find(open[a]!) === find(open[b]!)) continue;
      const stemSim = tokenJaccard(signatures[a]!, signatures[b]!);
      const optionSim = optionChoiceSimilarity(
        items[open[a]!]!.options ?? [],
        items[open[b]!]!.options ?? []
      );
      if (signaturesNear(stemSim, optionSim)) union(open[a]!, open[b]!);
    }
  }

  const labels = new Map<number, string>();
  let serial = 0;
  return items.map((item, index) => {
    const family = families[index];
    if (family) return family;
    const root = find(index);
    let label = labels.get(root);
    if (!label) {
      label = `near:${serial}`;
      serial += 1;
      labels.set(root, label);
    }
    return label;
  });
}
