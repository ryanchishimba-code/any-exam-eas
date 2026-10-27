import { describe, expect, it } from "vitest";
import { FREE_PASS_ALPHABET, MemoryFreePassStore, type PassCodeRow } from "@/lib/promo/free-pass";
import { generateFreePassBatch, isFreePassCodeShape } from "@/lib/promo/free-pass-codes";

function row(partial: Partial<PassCodeRow> = {}): PassCodeRow {
  return {
    id: "promo_1",
    code: "RN-7K4Q-2M",
    active: true,
    compDays: 30,
    audience: "nursing",
    expiryDate: null,
    maxUses: 1,
    currentUses: 0,
    ...partial,
  };
}

const now = new Date("2026-10-27T12:00:00.000Z");

describe("free pass redemption", () => {
  it("redeems a code once and grants 30 days", async () => {
    const store = new MemoryFreePassStore([row()]);
    const grant = await store.redeem({ userId: "user_a", code: "rn-7k4q-2m", now });
    expect(grant.compDays).toBe(30);
    expect(grant.compAccessUntil.toISOString()).toBe("2026-11-26T12:00:00.000Z");
    expect(grant.audience).toBe("nursing");
    expect(store.rows[0]?.currentUses).toBe(1);
    expect(store.redemptions).toEqual([{ promoCodeId: "promo_1", userId: "user_a" }]);
  });

  it("rejects a second use", async () => {
    const store = new MemoryFreePassStore([row()]);
    await store.redeem({ userId: "user_a", code: "RN-7K4Q-2M", now });
    await expect(store.redeem({ userId: "user_b", code: "RN-7K4Q-2M", now })).rejects.toThrow(
      /already been used/
    );
    expect(store.rows[0]?.currentUses).toBe(1);
    expect(store.redemptions).toHaveLength(1);
  });

  it("lets only one of many concurrent redeems succeed", async () => {
    const store = new MemoryFreePassStore([row()]);
    const results = await Promise.allSettled(
      Array.from({ length: 8 }, (_, index) =>
        store.redeem({ userId: `user_${index}`, code: "RN-7K4Q-2M", now })
      )
    );
    const won = results.filter((result) => result.status === "fulfilled");
    const lost = results.filter((result) => result.status === "rejected");
    expect(won).toHaveLength(1);
    expect(lost).toHaveLength(7);
    expect(store.rows[0]?.currentUses).toBe(1);
    expect(store.redemptions).toHaveLength(1);
  });

  it("rejects an expired code before anyone is granted access", async () => {
    const store = new MemoryFreePassStore([
      row({ expiryDate: new Date("2026-10-01T00:00:00.000Z") }),
    ]);
    await expect(store.redeem({ userId: "user_a", code: "RN-7K4Q-2M", now })).rejects.toThrow(
      /expired/
    );
    expect(store.rows[0]?.currentUses).toBe(0);
    expect(store.redemptions).toHaveLength(0);
  });

  it("rejects unknown, inactive, and discount codes", async () => {
    const store = new MemoryFreePassStore([
      row({ code: "RN-OFF-22", active: false }),
      row({ id: "promo_discount", code: "SAVE20", compDays: null, maxUses: 100 }),
    ]);
    await expect(store.redeem({ userId: "user_a", code: "RN-NOPE-99", now })).rejects.toThrow(
      /isn’t valid/
    );
    await expect(store.redeem({ userId: "user_a", code: "RN-OFF-22", now })).rejects.toThrow(
      /no longer active/
    );
    await expect(store.redeem({ userId: "user_a", code: "SAVE20", now })).rejects.toThrow(
      /isn’t a free pass/
    );
  });
});

describe("free pass batch", () => {
  it("builds 100 nursing and 50 pharmacy codes without ambiguous characters", () => {
    let n = 0;
    const random = () => {
      n += 1;
      return ((n * 17) % 997) / 997;
    };
    const codes = generateFreePassBatch({ random });
    expect(codes.filter((item) => item.audience === "nursing")).toHaveLength(100);
    expect(codes.filter((item) => item.audience === "pharmacy")).toHaveLength(50);
    expect(new Set(codes.map((item) => item.code)).size).toBe(150);
    for (const item of codes) {
      expect(item.compDays).toBe(30);
      expect(item.maxUses).toBe(1);
      expect(isFreePassCodeShape(item.code)).toBe(true);
      expect(item.code.startsWith(item.audience === "nursing" ? "RN-" : "RX-")).toBe(true);
      for (const char of item.code) {
        if (char === "-") continue;
        expect(FREE_PASS_ALPHABET.includes(char) || char === "R" || char === "N" || char === "X").toBe(
          true
        );
        expect("0O1IL".includes(char)).toBe(false);
      }
    }
  });
});
