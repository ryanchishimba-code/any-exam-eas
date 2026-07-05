import { prisma } from "@/lib/prisma";

export { searchUsers, serializeInternalUserRows } from "@/lib/crm/internal-user-list";
export type { InternalUserListRow } from "@/lib/crm/internal-user-list";

export async function getCrmUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      usageMetrics: true,
      preferences: true,
      legalConsent: true,
      supportNotes: {
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: 50,
        include: { author: { select: { id: true, name: true, email: true } } },
      },
      internalTags: { orderBy: { createdAt: "desc" } },
      bookmarksReceived: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { employee: { select: { id: true, name: true, email: true } } },
      },
      deviceHistory: { orderBy: { lastSeenAt: "desc" }, take: 5 },
      userSessions: { orderBy: { lastSeenAt: "desc" }, take: 10 },
    },
  });

  if (!user) return null;

  const [activityTimeline, generationHistory, recentEvents, examCount, quiltCount] =
    await Promise.all([
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 40,
      }),
      prisma.generationHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.analyticsEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
      prisma.generatedExam.count({ where: { userId } }),
      prisma.learningQuilt.count({ where: { userId } }),
    ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      lastActiveAt: user.lastActiveAt,
    },
    subscription: user.subscription,
    usageMetrics: user.usageMetrics,
    preferences: user.preferences,
    legalConsent: user.legalConsent,
    supportNotes: user.supportNotes,
    internalTags: user.internalTags,
    bookmarks: user.bookmarksReceived,
    devices: user.deviceHistory,
    sessions: user.userSessions,
    activityTimeline,
    generationHistory,
    recentEvents: recentEvents.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      category: e.category,
      metadata: e.metadata ? JSON.parse(e.metadata) : null,
      createdAt: e.createdAt,
    })),
    counts: { exams: examCount, quilts: quiltCount },
  };
}
