import type { SubjectArea, TaxonomyNode } from "./types";

export function flattenTaxonomySubjects(root: TaxonomyNode): SubjectArea[] {
  const areas: SubjectArea[] = [];
  const walk = (node: TaxonomyNode) => {
    if (node.subjectId) {
      const match = findSubjectInTree(root, node.subjectId);
      if (match?.subjectArea) areas.push(match.subjectArea);
    }
    node.children?.forEach(walk);
  };
  walk(root);
  return areas;
}

function findSubjectInTree(
  root: TaxonomyNode,
  subjectId: string
): { subjectArea?: SubjectArea } | undefined {
  if (root.subjectId === subjectId && root.subjectArea) {
    return { subjectArea: root.subjectArea };
  }
  for (const child of root.children ?? []) {
    const found = findSubjectInTree(child, subjectId);
    if (found) return found;
  }
  return undefined;
}

/** Attach subject area records to leaf taxonomy nodes by id. */
export function linkTaxonomyToSubjects(
  root: TaxonomyNode,
  subjects: SubjectArea[]
): TaxonomyNode {
  const byId = new Map(subjects.map((s) => [s.id, s]));

  const link = (node: TaxonomyNode): TaxonomyNode => {
    const subjectArea = node.subjectId ? byId.get(node.subjectId) : undefined;
    return {
      ...node,
      subjectArea,
      children: node.children?.map(link),
    };
  };

  return link(root);
}

export function getTaxonomyPath(
  root: TaxonomyNode,
  subjectId: string
): TaxonomyNode[] {
  const path: TaxonomyNode[] = [];
  const dfs = (node: TaxonomyNode, trail: TaxonomyNode[]): boolean => {
    const next = [...trail, node];
    if (node.subjectId === subjectId) {
      path.push(...next);
      return true;
    }
    for (const child of node.children ?? []) {
      if (dfs(child, next)) return true;
    }
    return false;
  };
  dfs(root, []);
  return path;
}

export function getPrerequisites(
  subjects: SubjectArea[],
  subjectId: string
): SubjectArea[] {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject?.prerequisites?.length) return [];
  return subject.prerequisites
    .map((id) => subjects.find((s) => s.id === id))
    .filter((s): s is SubjectArea => Boolean(s));
}
