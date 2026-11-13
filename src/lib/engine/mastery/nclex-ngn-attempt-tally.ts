import { Prisma } from "@prisma/client";
import { resolveBlueprintCategoryIdForAttempt } from "@/lib/learning/attempt-blueprint-attribution";
import type { DomainAttemptTally } from "@/lib/engine/mastery/attempt-progress";

/**
 * Published ngn_item rows are not QuestionBankItem ids.
 * A bank join on bankItemId leaves client needs empty for `ngn:` keys.
 * This lateral join fills that column from the item, then the case.
 */
export const NGN_ATTEMPT_CLIENT_NEED_JOIN = `
LEFT JOIN LATERAL (
  SELECT COALESCE(
    NULLIF(BTRIM(ni.client_needs->>'category'), ''),
    NULLIF(BTRIM(ni.client_needs->>'subcategory'), ''),
    NULLIF(BTRIM(nc.primary_client_need), '')
  ) AS client_need
  FROM ngn_item ni
  LEFT JOIN ngn_case nc
    ON nc.id = ni.case_id AND nc.version = ni.case_version
  WHERE qa."bankItemId" ~ '^ngn:[^:]+:v[0-9]+$'
    AND ni.id = substring(qa."bankItemId" from '^ngn:([^:]+):v[0-9]+$')
    AND ni.version = (substring(qa."bankItemId" from ':v([0-9]+)$'))::int
    AND ni.status = 'published'
  LIMIT 1
) ngn ON TRUE
`;

export function ngnAttemptClientNeedJoin(fieldId: string): Prisma.Sql {
  return fieldId === "nursing" ? Prisma.raw(NGN_ATTEMPT_CLIENT_NEED_JOIN) : Prisma.empty;
}

export function domainTalliesFromAttemptGroups(
  fieldId: string,
  rows: readonly {
    subjectId: string | null;
    clientNeeds: string | null;
    blueprintDomain: string | null;
    answered: number;
    correct: number;
  }[]
): DomainAttemptTally[] {
  const totals = new Map<string, DomainAttemptTally>();
  for (const row of rows) {
    const domainId = resolveBlueprintCategoryIdForAttempt(fieldId, {
      subjectId: row.subjectId,
      clientNeeds: row.clientNeeds,
      blueprintDomain: row.blueprintDomain,
    });
    if (!domainId) continue;
    const current = totals.get(domainId) ?? { domainId, answered: 0, correct: 0 };
    current.answered += Number(row.answered) || 0;
    current.correct += Number(row.correct) || 0;
    totals.set(domainId, current);
  }
  return [...totals.values()];
}
