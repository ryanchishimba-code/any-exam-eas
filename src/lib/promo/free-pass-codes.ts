import { randomInt } from "node:crypto";
import { FREE_PASS_ALPHABET } from "./free-pass";

export const FREE_PASS_COMP_DAYS = 30;
export const NURSING_PASS_COUNT = 100;
export const PHARMACY_PASS_COUNT = 50;

export type FreePassAudience = "nursing" | "pharmacy";

export type FreePassCode = {
  code: string;
  audience: FreePassAudience;
  compDays: number;
  maxUses: 1;
};

const CODE_RE = /^(RN|RX)-[2-9ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[2-9ABCDEFGHJKMNPQRSTUVWXYZ]{2}$/;

function chunk(random: () => number, length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(random() * FREE_PASS_ALPHABET.length);
    out += FREE_PASS_ALPHABET[index] ?? "2";
  }
  return out;
}

export function formatFreePassCode(prefix: "RN" | "RX", random: () => number = cryptoRandom): string {
  return `${prefix}-${chunk(random, 4)}-${chunk(random, 2)}`;
}

export function isFreePassCodeShape(code: string): boolean {
  return CODE_RE.test(code);
}

function cryptoRandom(): number {
  return randomInt(0, FREE_PASS_ALPHABET.length) / FREE_PASS_ALPHABET.length;
}

export function generateFreePassBatch(options?: {
  nursing?: number;
  pharmacy?: number;
  random?: () => number;
}): FreePassCode[] {
  const nursing = options?.nursing ?? NURSING_PASS_COUNT;
  const pharmacy = options?.pharmacy ?? PHARMACY_PASS_COUNT;
  const random = options?.random ?? cryptoRandom;
  const seen = new Set<string>();
  const codes: FreePassCode[] = [];

  function take(prefix: "RN" | "RX", audience: FreePassAudience, count: number) {
    let guard = 0;
    while (codes.filter((row) => row.audience === audience).length < count) {
      guard += 1;
      if (guard > count * 100) {
        throw new Error(`Could not generate ${count} unique ${prefix} pass codes.`);
      }
      const code = formatFreePassCode(prefix, random);
      if (seen.has(code)) continue;
      seen.add(code);
      codes.push({ code, audience, compDays: FREE_PASS_COMP_DAYS, maxUses: 1 });
    }
  }

  take("RN", "nursing", nursing);
  take("RX", "pharmacy", pharmacy);
  return codes;
}

export function freePassesToCsv(codes: FreePassCode[]): string {
  const lines = ["code,audience,comp_days,max_uses"];
  for (const row of codes) {
    lines.push(`${row.code},${row.audience},${row.compDays},${row.maxUses}`);
  }
  return `${lines.join("\n")}\n`;
}
