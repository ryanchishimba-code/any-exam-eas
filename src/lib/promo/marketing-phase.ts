/** Printed flyer campaign. Codes outside this name stay out of the tracker totals. */
export const MARKETING_PHASE_1 = "Marketing Phase 1";

export type PassStatus = "unused" | "redeemed";

export type MarketingPass = {
  code: string;
  audience: string | null;
  campaign: string | null;
  currentUses: number;
  redeemedAt: Date | null;
  redeemerEmail: string | null;
};

export type MarketingFilter = {
  audience?: string | null;
  status?: string | null;
};

export type CampaignTotals = {
  campaign: string;
  issued: number;
  redeemed: number;
  redeemedPercent: number;
  nursingIssued: number;
  nursingRedeemed: number;
  pharmacyIssued: number;
  pharmacyRedeemed: number;
};

export function freePassInsertData(row: {
  code: string;
  audience: string;
  compDays: number;
  maxUses: number;
}) {
  return {
    code: row.code,
    audience: row.audience,
    compDays: row.compDays,
    maxUses: row.maxUses,
    currentUses: 0,
    active: true,
    campaign: MARKETING_PHASE_1,
  };
}

export function passStatus(row: Pick<MarketingPass, "currentUses" | "redeemedAt">): PassStatus {
  return row.currentUses > 0 || row.redeemedAt != null ? "redeemed" : "unused";
}

export function filterMarketingPasses(rows: MarketingPass[], filter: MarketingFilter = {}): MarketingPass[] {
  const audience = filter.audience && filter.audience !== "all" ? filter.audience : null;
  const status = filter.status && filter.status !== "all" ? filter.status : null;
  return rows.filter((row) => {
    if (audience && row.audience !== audience) return false;
    if (status && passStatus(row) !== status) return false;
    return true;
  });
}

export function summarizeCampaign(
  rows: MarketingPass[],
  campaign = MARKETING_PHASE_1
): CampaignTotals {
  const scoped = rows.filter((row) => row.campaign === campaign);
  const redeemedOf = (list: MarketingPass[]) => list.filter((row) => passStatus(row) === "redeemed").length;
  const nursing = scoped.filter((row) => row.audience === "nursing");
  const pharmacy = scoped.filter((row) => row.audience === "pharmacy");
  const issued = scoped.length;
  const redeemed = redeemedOf(scoped);
  return {
    campaign,
    issued,
    redeemed,
    redeemedPercent: issued === 0 ? 0 : Math.round((redeemed / issued) * 1000) / 10,
    nursingIssued: nursing.length,
    nursingRedeemed: redeemedOf(nursing),
    pharmacyIssued: pharmacy.length,
    pharmacyRedeemed: redeemedOf(pharmacy),
  };
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function marketingPassesToCsv(rows: MarketingPass[]): string {
  const header = "code,audience,campaign,status,redeemed_at,redeemer_email";
  const lines = rows.map((row) =>
    [
      row.code,
      row.audience ?? "",
      row.campaign ?? "",
      passStatus(row),
      row.redeemedAt ? row.redeemedAt.toISOString() : "",
      row.redeemerEmail ?? "",
    ]
      .map(csvCell)
      .join(",")
  );
  return [header, ...lines].join("\n");
}
