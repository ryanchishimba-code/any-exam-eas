import type { LucideIcon } from "lucide-react";
import { Activity, Bone, BookOpenCheck, HeartPulse, Pill } from "lucide-react";
import type { BoardMarketingSlug } from "@/lib/landing/tokens";

const BOARD_PICKER_ICONS: Record<BoardMarketingSlug, LucideIcon> = {
  nclex: Activity,
  usmle: BookOpenCheck,
  naplex: Pill,
  pance: HeartPulse,
  "aanp-fnp": HeartPulse,
  "npte-pt": Bone,
};

export function boardPickerIcon(slug: BoardMarketingSlug | null): LucideIcon {
  if (!slug) return Activity;
  return BOARD_PICKER_ICONS[slug];
}
