import { prisma } from "@/lib/prisma";
import { summarizeBillingCycle, type BillingCycleSummary } from "@/lib/crm/billing-cycle";
import {
  summarizeConsentForList,
  type ConsentListSummary,
} from "@/lib/legal/consent-record";

export type InternalUserListRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  lastActiveAt: Date | null;
  createdAt: Date;
  consent?: ConsentListSummary;
  billing?: BillingCycleSummary;
};

const baseUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  accountStatus: true,
  lastActiveAt: true,
  lastLoginAt: true,
  createdAt: true,
  usageMetrics: true,
  subscription: {
    select: {
      status: true,
      plan: true,
      planInterval: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
      canceledAt: true,
      compAccessUntil: true,
    },
  },
  legalConsent: {
    select: {
      acceptedAt: true,
      termsVersion: true,
      signupMethod: true,
    },
  },
} as const;

function mapUserRow(
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    accountStatus: string;
    lastActiveAt: Date | null;
    createdAt: Date;
    subscription: Parameters<typeof summarizeBillingCycle>[0];
    legalConsent: {
      acceptedAt: Date;
      termsVersion: string;
      signupMethod: string;
    } | null;
  },
  includeAdminFields: boolean
): InternalUserListRow {
  const row: InternalUserListRow = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    lastActiveAt: user.lastActiveAt,
    createdAt: user.createdAt,
  };

  if (includeAdminFields) {
    row.consent = summarizeConsentForList(user.legalConsent, user.createdAt);
    row.billing = summarizeBillingCycle(user.subscription);
  }

  return row;
}

export async function searchUsers(query: string, limit = 25, includeAdminFields = false) {
  const q = query.trim().toLowerCase();
  const select = baseUserSelect;

  if (!q) {
    const users = await prisma.user.findMany({
      where: { accountStatus: { not: "deleted" } },
      orderBy: { lastActiveAt: "desc" },
      take: limit,
      select,
    });
    return users.map((u) => mapUserRow(u, includeAdminFields));
  }

  const users = await prisma.user.findMany({
    where: {
      accountStatus: { not: "deleted" },
      OR: [{ email: { contains: q } }, { name: { contains: q } }],
    },
    take: limit,
    select,
  });

  return users.map((u) => mapUserRow(u, includeAdminFields));
}

/** Serialize admin CRM rows for JSON API responses. */
export function serializeInternalUserRows(rows: InternalUserListRow[]) {
  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    accountStatus: u.accountStatus,
    lastActiveAt: u.lastActiveAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
    consent: u.consent,
    billing: u.billing,
  }));
}
