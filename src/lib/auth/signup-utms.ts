const MAX_UTM_LENGTH = 120;

export type SignupUtms = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

function cleanUtm(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, MAX_UTM_LENGTH);
  return trimmed || undefined;
}

/** Read campaign tags from a signup body. Unknown keys and non-strings are ignored. */
export function readSignupUtms(raw: Record<string, unknown>): SignupUtms {
  return {
    utmSource: cleanUtm(raw.utm_source) ?? cleanUtm(raw.utmSource),
    utmMedium: cleanUtm(raw.utm_medium) ?? cleanUtm(raw.utmMedium),
    utmCampaign: cleanUtm(raw.utm_campaign) ?? cleanUtm(raw.utmCampaign),
  };
}
