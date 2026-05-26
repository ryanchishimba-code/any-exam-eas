import { prisma } from "@/lib/prisma";

export async function addSupportNote(params: {
  userId: string;
  authorId: string;
  body: string;
  pinned?: boolean;
}) {
  return prisma.supportNote.create({
    data: {
      userId: params.userId,
      authorId: params.authorId,
      body: params.body.trim(),
      pinned: params.pinned ?? false,
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function addInternalTag(params: {
  userId: string;
  tag: string;
  createdById: string;
}) {
  const normalized = params.tag.trim().toLowerCase();
  return prisma.userInternalTag.upsert({
    where: { userId_tag: { userId: params.userId, tag: normalized } },
    create: {
      userId: params.userId,
      tag: normalized,
      createdById: params.createdById,
    },
    update: {},
  });
}

export async function removeInternalTag(userId: string, tag: string) {
  return prisma.userInternalTag.delete({
    where: { userId_tag: { userId, tag: tag.trim().toLowerCase() } },
  });
}

export async function toggleBookmark(params: {
  employeeId: string;
  userId: string;
  note?: string;
}) {
  const existing = await prisma.userBookmark.findUnique({
    where: {
      employeeId_userId: {
        employeeId: params.employeeId,
        userId: params.userId,
      },
    },
  });

  if (existing) {
    await prisma.userBookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await prisma.userBookmark.create({
    data: {
      employeeId: params.employeeId,
      userId: params.userId,
      note: params.note,
    },
  });
  return { bookmarked: true };
}
