/** Single-use complimentary passes. No Stripe and no card. */

export const FREE_PASS_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

const AMBIGUOUS = /[0O1IL]/;

export type PassRejectReason = "invalid" | "inactive" | "expired" | "used" | "not_a_pass";

export type PassCodeRow = {
  id: string;
  code: string;
  active: boolean;
  compDays: number | null;
  audience: string | null;
  expiryDate: Date | null;
  maxUses: number | null;
  currentUses: number;
};

export type PassGrant = {
  promoCodeId: string;
  code: string;
  audience: string | null;
  compDays: number;
  compAccessUntil: Date;
};

export function passRejectMessage(reason: PassRejectReason): string {
  switch (reason) {
    case "invalid":
      return "That pass code isn’t valid. Check the code and try again.";
    case "inactive":
      return "That pass code is no longer active.";
    case "expired":
      return "That pass code has expired.";
    case "used":
      return "That pass code has already been used.";
    case "not_a_pass":
      return "That code isn’t a free pass. Check the code and try again.";
  }
}

export class FreePassError extends Error {
  readonly reason: PassRejectReason;

  constructor(reason: PassRejectReason) {
    super(passRejectMessage(reason));
    this.name = "FreePassError";
    this.reason = reason;
  }
}

export function normalizePassCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function addCompDays(now: Date, days: number): Date {
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

export function classifyPassRow(
  row: PassCodeRow | null,
  now: Date
): { ok: true; compDays: number } | { ok: false; reason: PassRejectReason } {
  if (!row) return { ok: false, reason: "invalid" };
  if (!row.active) return { ok: false, reason: "inactive" };
  if (row.compDays == null || row.compDays <= 0) return { ok: false, reason: "not_a_pass" };
  if (row.expiryDate && row.expiryDate.getTime() <= now.getTime()) {
    return { ok: false, reason: "expired" };
  }
  if (row.maxUses == null || row.currentUses >= row.maxUses) {
    return { ok: false, reason: "used" };
  }
  return { ok: true, compDays: row.compDays };
}

/**
 * Apply a claim to a row that is already locked.
 * `markUsed` must succeed only when currentUses is still under maxUses.
 */
export function claimLockedRow(
  row: PassCodeRow | null,
  now: Date,
  markUsed: (row: PassCodeRow) => boolean
): { ok: true; compDays: number } | { ok: false; reason: PassRejectReason } {
  const decision = classifyPassRow(row, now);
  if (!decision.ok || !row) return decision;
  if (!markUsed(row)) return { ok: false, reason: "used" };
  return decision;
}

export type FreePassStore = {
  redeem(input: { userId: string; code: string; now: Date }): Promise<PassGrant>;
};

/** In-memory store. Transactions for one code run one at a time, like SELECT FOR UPDATE. */
export class MemoryFreePassStore implements FreePassStore {
  readonly redemptions: { promoCodeId: string; userId: string }[] = [];
  private readonly chains = new Map<string, Promise<unknown>>();

  constructor(readonly rows: PassCodeRow[]) {}

  async redeem(input: { userId: string; code: string; now: Date }): Promise<PassGrant> {
    const code = normalizePassCode(input.code);
    return this.locked(code, async () => {
      const row = this.rows.find((item) => item.code === code) ?? null;
      const decision = claimLockedRow(row, input.now, (locked) => {
        if (locked.maxUses == null || locked.currentUses >= locked.maxUses) return false;
        locked.currentUses += 1;
        return true;
      });
      if (!decision.ok || !row) {
        throw new FreePassError(!decision.ok ? decision.reason : "invalid");
      }
      this.redemptions.push({ promoCodeId: row.id, userId: input.userId });
      return {
        promoCodeId: row.id,
        code: row.code,
        audience: row.audience,
        compDays: decision.compDays,
        compAccessUntil: addCompDays(input.now, decision.compDays),
      };
    });
  }

  private locked<T>(code: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.chains.get(code) ?? Promise.resolve();
    const run = prev.then(fn, fn);
    this.chains.set(
      code,
      run.then(
        () => undefined,
        () => undefined
      )
    );
    return run;
  }
}

export function assertPassAlphabet(code: string): boolean {
  const body = code.replace(/^(RN|RX)-/, "").replace(/-/g, "");
  return body.length > 0 && !AMBIGUOUS.test(body) && [...body].every((ch) => FREE_PASS_ALPHABET.includes(ch));
}
