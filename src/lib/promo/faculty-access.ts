import { SITE_DOMAIN } from "@/lib/site";
import { normalizePassCode } from "@/lib/promo/free-pass";

/**
 * One shared faculty pass. It is an in-app complimentary grant (PromoCode.compDays),
 * not a Stripe coupon. A 100% off first month would still open a subscription that
 * renews at the paid price and needs a card. This grant takes no card and ends
 * on its own.
 */
export const FACULTY_ACCESS_CODE = "FACULTY30";
export const FACULTY_ACCESS_DAYS = 30;
export const FACULTY_ACCESS_MAX_USES = 50;
/** About six months after 2026-11-09. End of that UTC day. */
export const FACULTY_ACCESS_EXPIRES_AT = new Date("2027-05-09T23:59:59.000Z");
export const FACULTY_ACCESS_EXPIRES_LABEL = "May 9, 2027";
export const FACULTY_ACCESS_PATH = `/signup?code=${FACULTY_ACCESS_CODE}`;
export const FACULTY_ACCESS_URL = `https://www.${SITE_DOMAIN}${FACULTY_ACCESS_PATH}`;

export function isFacultyAccessCode(code: string): boolean {
  return normalizePassCode(code) === FACULTY_ACCESS_CODE;
}

export function passCodeHelp(code: string): string {
  if (isFacultyAccessCode(code)) {
    return `Faculty access: ${FACULTY_ACCESS_DAYS} days of Pro. No card. We will not charge you for this access, now or later. It ends after ${FACULTY_ACCESS_DAYS} days unless you choose a paid plan. Up to ${FACULTY_ACCESS_MAX_USES} faculty accounts can use this code, once each, through ${FACULTY_ACCESS_EXPIRES_LABEL}.`;
  }
  return "30 days of Pro. No card and no charge. Each printed code works once.";
}
