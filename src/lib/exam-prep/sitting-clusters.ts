/**
 * Near-duplicate clusters for one sitting.
 * Identical option sets cluster even when the stem is paraphrased. When the
 * choices largely match, a lower stem threshold applies. The case text is part
 * of the stem, so a shared lead-in such as "What is the next best step" does
 * not glue unrelated scenarios together. Candidate pairs come from an option
 * index and a stem minhash instead of comparing every row.
 */
import type { BankItem } from "@/lib/question-bank";
import { normalizeClinicalCaseText } from "@/lib/exam-prep/clinical-case-dedupe";
import { templateGroupKeys } from "@/lib/exam-prep/template-groups";
import { optionChoiceSimilarity, optionsFingerprint } from "@/lib/questions/session-quality";

const FAMILY_META_KEYS = [
  "templateId",
  "templateFamilyId",
  "familyId",
  "stemTemplateId",
  "templateFamily",
] as const;

/** Stem-only copies. Below this, wording alone is not enough. */
const STEM_HIGH = 0.92;
const STEM_NEAR = 0.72;
/** Paraphrased clones sit near 0.36 stem similarity when the choices still match. */
const STEM_WHEN_OPTIONS_MATCH = 0.34;
const OPTION_LARGELY = 0.6;
/** Same choice list, or one distractor swapped. Stem similarity is not required. */
const OPTION_NEAR_IDENTICAL = 0.85;
const MINHASH_SIZE = 16;
const BAND_SIZE = 2;
const BAND_BUCKET_CAP = 24;
const OPTION_BUCKET_CAP = 80;

function signaturesNear(stemSim: number, optionSim: number): boolean {
  if (optionSim >= OPTION_NEAR_IDENTICAL) return true;
  if (optionSim >= OPTION_LARGELY && stemSim >= STEM_WHEN_OPTIONS_MATCH) return true;
  if (stemSim >= STEM_HIGH) return true;
  return stemSim >= STEM_NEAR && optionSim >= OPTION_LARGELY;
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
  const setId = payload.setId;
  if (typeof setId !== "string" || !setId.trim()) return null;
  if (payload.kind === "sequential" || typeof payload.stepIndex === "number") return setId.trim();
  return null;
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

function optionText(option: unknown): string {
  if (typeof option === "string") return option;
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    for (const key of ["text", "label", "value", "content"]) {
      if (typeof record[key] === "string") return record[key];
    }
  }
  return "";
}

function payloadCaseText(item: BankItem): string {
  const payload = item.ngnPayload;
  if (!payload || typeof payload !== "object") return "";
  const chunks: string[] = [];
  for (const key of ["text", "passage", "scenario", "vignette", "caseStem", "stem"]) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) chunks.push(value.trim());
  }
  return chunks.join(" ");
}

/** Question plus the case the student sees. The lead-in alone is not a template. */
function itemStem(item: BankItem): string {
  const vignette =
    (typeof item.vignette === "string" ? item.vignette.trim() : "") ||
    (typeof item.scenario === "string" ? item.scenario.trim() : "");
  const question = typeof item.question === "string" ? item.question.trim() : "";
  return [vignette, payloadCaseText(item), question].filter(Boolean).join(" ");
}

function pairIsNear(a: BankItem, b: BankItem): boolean {
  const familyA = templateFamilyId(a);
  const familyB = templateFamilyId(b);
  const optionSim = optionChoiceSimilarity(a.options ?? [], b.options ?? []);
  if (familyA && familyB && familyA !== familyB) return optionSim >= 0.999;
  if (familyA && familyB) return true;
  const stemSim = tokenJaccard(stemTokens(itemStem(a)), stemTokens(itemStem(b)));
  return signaturesNear(stemSim, optionSim);
}

/** True when two rows are the same template with light wording or dose edits. */
export function itemsAreNearDuplicates(a: BankItem, b: BankItem): boolean {
  return pairIsNear(a, b);
}

function tokenHash(token: string, seed: number): number {
  let hash = seed >>> 0;
  for (let i = 0; i < token.length; i++) {
    hash = Math.imul(hash ^ token.charCodeAt(i), 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function minhashSignature(tokens: readonly string[]): Uint32Array {
  const signature = new Uint32Array(MINHASH_SIZE);
  signature.fill(0xffffffff);
  for (const token of tokens) {
    for (let i = 0; i < MINHASH_SIZE; i++) {
      const hash = tokenHash(token, 0x9e3779b9 + i * 0x85ebca6b);
      if (hash < signature[i]!) signature[i] = hash;
    }
  }
  return signature;
}

function bandKey(signature: Uint32Array, band: number): string {
  const start = band * BAND_SIZE;
  return `${band}:${signature[start]}:${signature[start + 1]}`;
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
  const byTemplate = new Map<string, number>();
  for (let i = 0; i < items.length; i++) {
    for (const key of templateGroupKeys(items[i]!)) {
      const prior = byTemplate.get(key);
      if (prior == null) byTemplate.set(key, i);
      else union(prior, i);
    }
  }

  const byFamily = new Map<string, number>();
  for (let i = 0; i < items.length; i++) {
    const family = families[i];
    if (!family) continue;
    const prior = byFamily.get(family);
    if (prior == null) byFamily.set(family, i);
    else union(prior, i);
  }

  const fingerprints = items.map((item) => optionsFingerprint(item.options));
  const byFingerprint = new Map<string, number[]>();
  for (let i = 0; i < items.length; i++) {
    const fingerprint = fingerprints[i];
    if (!fingerprint) continue;
    const bucket = byFingerprint.get(fingerprint);
    if (bucket) bucket.push(i);
    else byFingerprint.set(fingerprint, [i]);
  }
  for (const bucket of byFingerprint.values()) {
    const head = bucket[0]!;
    for (let i = 1; i < bucket.length; i++) union(head, bucket[i]!);
  }

  const stemSets = items.map((item) => stemTokens(itemStem(item)));
  const signatures = stemSets.map((tokens) => minhashSignature(tokens));
  const seenPairs = new Set<string>();
  const consider = (left: number, right: number) => {
    if (left === right) return;
    const a = left < right ? left : right;
    const b = left < right ? right : left;
    if (find(a) === find(b)) return;
    const key = `${a}:${b}`;
    if (seenPairs.has(key)) return;
    seenPairs.add(key);
    const familyA = families[a];
    const familyB = families[b];
    const optionSim =
      fingerprints[a] && fingerprints[a] === fingerprints[b]
        ? 1
        : optionChoiceSimilarity(items[a]!.options ?? [], items[b]!.options ?? []);
    if (familyA && familyB && familyA !== familyB) {
      if (optionSim >= 0.999) union(a, b);
      return;
    }
    if (familyA && familyB) {
      union(a, b);
      return;
    }
    const stemSim = tokenJaccard(stemSets[a]!, stemSets[b]!);
    if (signaturesNear(stemSim, optionSim)) union(a, b);
  };

  const optionBuckets = new Map<string, number[]>();
  for (let i = 0; i < items.length; i++) {
    const options = items[i]!.options ?? [];
    if (options.length < 3) continue;
    const normalized = [...options]
      .map((option) => (typeof option === "string" ? option : optionText(option)).trim().toLowerCase())
      .filter(Boolean)
      .sort();
    if (normalized.length < 3) continue;
    for (let omit = 0; omit < normalized.length; omit++) {
      const key = normalized.filter((_, index) => index !== omit).join("\0");
      const bucket = optionBuckets.get(key);
      if (bucket) bucket.push(i);
      else optionBuckets.set(key, [i]);
    }
  }
  for (const bucket of optionBuckets.values()) {
    if (bucket.length < 2 || bucket.length > OPTION_BUCKET_CAP) continue;
    for (let a = 0; a < bucket.length; a++) {
      for (let b = a + 1; b < bucket.length; b++) consider(bucket[a]!, bucket[b]!);
    }
  }

  const bands = MINHASH_SIZE / BAND_SIZE;
  const bandBuckets = new Map<string, number[]>();
  for (let i = 0; i < items.length; i++) {
    if (stemSets[i]!.length === 0) continue;
    for (let band = 0; band < bands; band++) {
      const key = bandKey(signatures[i]!, band);
      const bucket = bandBuckets.get(key);
      if (bucket) bucket.push(i);
      else bandBuckets.set(key, [i]);
    }
  }
  for (const bucket of bandBuckets.values()) {
    if (bucket.length < 2 || bucket.length > BAND_BUCKET_CAP) continue;
    for (let a = 0; a < bucket.length; a++) {
      for (let b = a + 1; b < bucket.length; b++) consider(bucket[a]!, bucket[b]!);
    }
  }

  const roots = items.map((_, index) => find(index));
  const labelByRoot = new Map<number, string>();
  for (let i = 0; i < items.length; i++) {
    const family = families[i];
    const root = roots[i]!;
    if (family && !labelByRoot.has(root)) labelByRoot.set(root, family);
  }
  let serial = 0;
  return roots.map((root) => {
    let label = labelByRoot.get(root);
    if (!label) {
      label = `near:${serial}`;
      serial += 1;
      labelByRoot.set(root, label);
    }
    return label;
  });
}
