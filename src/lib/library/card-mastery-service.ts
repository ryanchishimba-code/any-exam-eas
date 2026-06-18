import { cacheDeleteMatching, cacheKey } from "@/lib/cache";
import { getPrisma } from "@/lib/prisma";
import type { ExamSlug } from "@/types/edtech";
import type { CardMasteryStatus } from "./card-mastery";

export type MemoryCardMasteryDto = {
  cardId: string;
  status: CardMasteryStatus;
  updatedAt: string;
};

const VALID_STATUSES = new Set<CardMasteryStatus>(["got-it", "need-review"]);

export function isCardMasteryStatus(value: string): value is CardMasteryStatus {
  return VALID_STATUSES.has(value as CardMasteryStatus);
}

export async function listMemoryCardMastery(
  userId: string,
  examSlug: ExamSlug
): Promise<MemoryCardMasteryDto[]> {
  const prisma = getPrisma();
  const rows = await prisma.memoryCardMastery.findMany({
    where: { userId, examSlug },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    cardId: row.cardId,
    status: row.status as CardMasteryStatus,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function upsertMemoryCardMastery(
  userId: string,
  examSlug: ExamSlug,
  cardId: string,
  status: CardMasteryStatus
): Promise<MemoryCardMasteryDto> {
  if (!isCardMasteryStatus(status)) {
    throw new Error("Invalid mastery status");
  }

  const prisma = getPrisma();
  const row = await prisma.memoryCardMastery.upsert({
    where: {
      userId_examSlug_cardId: { userId, examSlug, cardId },
    },
    create: { userId, examSlug, cardId, status },
    update: { status },
  });

  invalidateLibraryBriefCache(userId, examSlug);

  return {
    cardId: row.cardId,
    status: row.status as CardMasteryStatus,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function syncMemoryCardMastery(
  userId: string,
  examSlug: ExamSlug,
  entries: MemoryCardMasteryDto[]
): Promise<MemoryCardMasteryDto[]> {
  const prisma = getPrisma();
  const valid = entries.filter((e) => isCardMasteryStatus(e.status));
  if (valid.length === 0) return listMemoryCardMastery(userId, examSlug);

  const server = await listMemoryCardMastery(userId, examSlug);
  const serverByCard = new Map(server.map((s) => [s.cardId, s]));

  const toWrite: MemoryCardMasteryDto[] = [];
  for (const entry of valid) {
    const existing = serverByCard.get(entry.cardId);
    if (!existing || entry.updatedAt > existing.updatedAt) {
      toWrite.push(entry);
    }
  }

  if (toWrite.length > 0) {
    await prisma.$transaction(
      toWrite.map((entry) =>
        prisma.memoryCardMastery.upsert({
          where: {
            userId_examSlug_cardId: { userId, examSlug, cardId: entry.cardId },
          },
          create: {
            userId,
            examSlug,
            cardId: entry.cardId,
            status: entry.status,
            updatedAt: new Date(entry.updatedAt),
          },
          update: {
            status: entry.status,
            updatedAt: new Date(entry.updatedAt),
          },
        })
      )
    );
    invalidateLibraryBriefCache(userId, examSlug);
  }

  return listMemoryCardMastery(userId, examSlug);
}

function invalidateLibraryBriefCache(userId: string, examSlug: ExamSlug): void {
  cacheDeleteMatching(cacheKey(["reference-brief", userId, examSlug]));
}
