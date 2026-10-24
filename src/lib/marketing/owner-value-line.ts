import { formatMonthlyPrice } from "@/lib/site";

/**
 * Pro is a single tier: one monthly price unlocks all six exam banks (see PRO_FEATURES).
 * Students choose a primary board in the app; they are not charged per board.
 */
export const HOME_OWNER_VALUE_LINE = `Pick any board for just ${formatMonthlyPrice("pro")}/mo. Here to save students money and deliver premium study.`;
