import type { Prisma } from "@prisma/client";

/** Procedural bulk filler is never served — only genuine seed/curated items reach learners. */
const EXCLUDE_BULK_FILLER = { NOT: { tags: { contains: "bulk-bank" } } } as const;

/** MPJE pool: selected state + federal (null state_code). */
export function mpjeStateOrFederalWhere(
  fieldId: string,
  subjectId: string | undefined,
  stateCode: string
): Prisma.QuestionBankItemWhereInput {
  const base: Prisma.QuestionBankItemWhereInput = {
    fieldId,
    active: true,
    qaPassed: true,
    ...EXCLUDE_BULK_FILLER,
    OR: [{ stateCode }, { stateCode: null }],
  };
  if (subjectId) base.subjectId = subjectId;
  return base;
}

export function mpjeStateOnlyWhere(
  fieldId: string,
  subjectId: string | undefined,
  stateCode: string
): Prisma.QuestionBankItemWhereInput {
  const base: Prisma.QuestionBankItemWhereInput = {
    fieldId,
    active: true,
    qaPassed: true,
    ...EXCLUDE_BULK_FILLER,
    stateCode,
  };
  if (subjectId) base.subjectId = subjectId;
  return base;
}

export function mpjeFederalOnlyWhere(
  fieldId: string,
  subjectId: string | undefined
): Prisma.QuestionBankItemWhereInput {
  const base: Prisma.QuestionBankItemWhereInput = {
    fieldId,
    active: true,
    qaPassed: true,
    ...EXCLUDE_BULK_FILLER,
    stateCode: null,
  };
  if (subjectId) base.subjectId = subjectId;
  return base;
}
