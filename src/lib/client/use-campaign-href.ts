"use client";

import { useEffect, useState } from "react";
import { withPageCampaignUtms } from "@/lib/marketing/campaign-utm";

/** After mount, fold current/session campaign UTMs onto signup hrefs. */
export function useCampaignAwareHref(href: string): string {
  const [resolved, setResolved] = useState(href);

  useEffect(() => {
    setResolved(withPageCampaignUtms(href));
  }, [href]);

  return resolved;
}
