import type { Prisma } from "@prisma/client";

/** MPJE pool: selected state + federal (null state_code). */
export function mpjeStateOrFederalWhere(
  fieldId: string,
  subjectId: string | undefined,
  stateCode: string
): Prisma.QuestionBankItemWhereInput {
  const base: Prisma.QuestionBankItemWhereInput = {
    fieldId,
    active: true,
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
    stateCode: null,
  };
  if (subjectId) base.subjectId = subjectId;
  return base;
}
