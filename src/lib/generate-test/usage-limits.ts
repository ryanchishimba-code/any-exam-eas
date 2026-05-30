import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UserAccess } from "@/lib/access-control";

export type UsageTier = "free" | "paid";

export const GENERATE_TEST_LIMITS = {
  free: {
    monthlyGenerations: 3,
    maxQuestions: 10,
    allowedDifficulties: ["easy", "medium"] as const,
  },
  paid: {
    monthlyGenerations: 200,
    maxQuestions: 50,
    allowedDifficulties: ["easy", "medium", "hard"] as const,
  },
} as const;

export function resolveUsageTier(access: UserAccess): UsageTier {
  if (access.hasPremiumAccess || access.role === "staff") return "paid";
  return "free";
}

function monthStartUtc(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));
}

export async function countMonthlyGenerations(userId: string): Promise<number> {
  return prisma.generationHistory.count({
    where: {
      userId,
      status: "success",
      createdAt: { gte: monthStartUtc() },
    },
  });
}

export type UsageCheckInput = {
  userId: string;
  access: UserAccess;
  questionCount: number;
  difficulty: string;
};

export type UsageCheckResult =
  | {
      ok: true;
      tier: UsageTier;
      usedThisMonth: number;
      limit: number;
      remaining: number;
    }
  | { ok: false; response: NextResponse };

export async function checkGenerateTestUsage(
  input: UsageCheckInput
): Promise<UsageCheckResult> {
  const tier = resolveUsageTier(input.access);
  const limits = GENERATE_TEST_LIMITS[tier];
  const usedThisMonth = await countMonthlyGenerations(input.userId);

  if (input.questionCount > limits.maxQuestions) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Your ${tier} plan allows up to ${limits.maxQuestions} questions per test.`,
          code: "QUESTION_LIMIT_EXCEEDED",
          tier,
          maxQuestions: limits.maxQuestions,
        },
        { status: 403 }
      ),
    };
  }

  const allowed = limits.allowedDifficulties as readonly string[];
  if (!allowed.includes(input.difficulty)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Difficulty "${input.difficulty}" is not available on the ${tier} plan.`,
          code: "DIFFICULTY_NOT_ALLOWED",
          tier,
          allowedDifficulties: [...limits.allowedDifficulties],
        },
        { status: 403 }
      ),
    };
  }

  if (usedThisMonth >= limits.monthlyGenerations) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Monthly test limit reached (${limits.monthlyGenerations} on ${tier} plan). Upgrade for more.`,
          code: "MONTHLY_LIMIT_REACHED",
          tier,
          usedThisMonth,
          limit: limits.monthlyGenerations,
        },
        { status: 429 }
      ),
    };
  }

  return {
    ok: true,
    tier,
    usedThisMonth,
    limit: limits.monthlyGenerations,
    remaining: limits.monthlyGenerations - usedThisMonth - 1,
  };
}
