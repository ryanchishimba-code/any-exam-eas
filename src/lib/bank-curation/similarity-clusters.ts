import type { SimilarPair } from "./types";

/** Union-Find for grouping similar question pairs into clusters. */
export class UnionFind {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root)!;
    let cur = x;
    while (cur !== root) {
      const next = this.parent.get(cur)!;
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }

  union(a: string, b: string): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    const rankA = this.rank.get(ra) ?? 0;
    const rankB = this.rank.get(rb) ?? 0;
    if (rankA < rankB) this.parent.set(ra, rb);
    else if (rankA > rankB) this.parent.set(rb, ra);
    else {
      this.parent.set(rb, ra);
      this.rank.set(ra, rankA + 1);
    }
  }
}

export function buildClustersFromPairs(
  allIds: string[],
  pairs: SimilarPair[]
): Map<string, string[]> {
  const uf = new UnionFind();
  for (const id of allIds) uf.find(id);
  for (const pair of pairs) uf.union(pair.a, pair.b);

  const groups = new Map<string, string[]>();
  for (const id of allIds) {
    const root = uf.find(id);
    const list = groups.get(root) ?? [];
    list.push(id);
    groups.set(root, list);
  }
  return groups;
}

export function assignClusterIds(groups: Map<string, string[]>): Map<string, string> {
  const idToCluster = new Map<string, string>();
  let index = 0;
  for (const members of groups.values()) {
    const clusterId = `nclex-c-${String(++index).padStart(5, "0")}`;
    for (const id of members) idToCluster.set(id, clusterId);
  }
  return idToCluster;
}

export function averagePairwiseSimilarity(
  memberIds: string[],
  pairs: SimilarPair[]
): number {
  if (memberIds.length <= 1) return 1;
  const set = new Set(memberIds);
  const relevant = pairs.filter((p) => set.has(p.a) && set.has(p.b));
  if (relevant.length === 0) return 0;
  return relevant.reduce((s, p) => s + p.similarity, 0) / relevant.length;
}

export function dedupePairs(pairs: SimilarPair[]): SimilarPair[] {
  const seen = new Set<string>();
  const out: SimilarPair[] = [];
  for (const p of pairs) {
    const key = p.a < p.b ? `${p.a}|${p.b}` : `${p.b}|${p.a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}
