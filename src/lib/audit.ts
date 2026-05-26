import { prisma } from "@/lib/prisma";
import { hashIp } from "@/lib/analytics/request-context";

export async function logAdminAction(params: {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  req?: Request;
}): Promise<void> {
  try {
    await prisma.adminAction.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        ipHash: hashIp(params.req),
      },
    });
  } catch {
    /* non-blocking */
  }
}
