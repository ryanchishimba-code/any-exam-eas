import { describe, expect, it } from "vitest";
import {
  attributionColumns,
  decodeFirstTouch,
  encodeFirstTouch,
  externalReferrer,
  mergeFirstTouch,
  readFirstTouchFromCookieHeader,
} from "@/lib/marketing/first-touch";

describe("first-touch attribution", () => {
  it("round-trips campaign tags and referrer", () => {
    const encoded = encodeFirstTouch({
      utmSource: "daily",
      utmMedium: "qotd",
      utmCampaign: "free_trial",
      referrer: "https://news.example/story",
    });
    expect(decodeFirstTouch(encoded)).toEqual({
      utmSource: "daily",
      utmMedium: "qotd",
      utmCampaign: "free_trial",
      referrer: "https://news.example/story",
    });
  });

  it("keeps the first snapshot", () => {
    const stored = { utmSource: "newsletter", referrer: "https://news.example/a" };
    expect(
      mergeFirstTouch(stored, {
        utmSource: "ad",
        utmMedium: "cpc",
        utmCampaign: "spring",
      })
    ).toEqual(stored);
  });

  it("reads the first-party cookie and drops same-site referrers", () => {
    const encoded = encodeFirstTouch({ utmSource: "partner" });
    expect(
      readFirstTouchFromCookieHeader(`theme=light; aee_ft=${encoded}; other=1`)
    ).toEqual({ utmSource: "partner" });
    expect(externalReferrer("https://www.anyexameasy.com/pricing", "https://www.anyexameasy.com")).toBeUndefined();
    expect(externalReferrer("https://news.example/story?utm_source=secret", "https://www.anyexameasy.com")).toBe(
      "https://news.example/story"
    );
  });

  it("maps only present fields onto the user", () => {
    expect(attributionColumns({ utmSource: "daily", referrer: "https://news.example/story" })).toEqual({
      utmSource: "daily",
      signupReferrer: "https://news.example/story",
    });
    expect(attributionColumns(undefined)).toEqual({});
  });
});
