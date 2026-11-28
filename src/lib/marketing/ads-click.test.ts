import { describe, expect, it } from "vitest";
import {
  adsClickFromSearch,
  decodeAdsClick,
  encodeAdsClick,
  readAdsClickFromCookieHeader,
} from "@/lib/marketing/ads-click";
import { captureAdsClick } from "@/lib/marketing/ads-click-client";

describe("ads click ids", () => {
  it("reads gclid from a landing URL", () => {
    const ids = adsClickFromSearch("?utm_source=google&gclid=Cj0KCQiA_abc-123456", 1000);
    expect(ids).toEqual({ gclid: "Cj0KCQiA_abc-123456", seenAt: 1000 });
  });

  it("falls back to gbraid then wbraid, one id only", () => {
    expect(adsClickFromSearch("?gbraid=0AAAAAabcdefgh1234&wbraid=CkQxxxxxxxxxx", 1).gbraid).toBeDefined();
    expect(adsClickFromSearch("?wbraid=CkQxxxxxxxxxx", 1).wbraid).toBe("CkQxxxxxxxxxx");
  });

  it("rejects short or unsafe values", () => {
    expect(adsClickFromSearch("?gclid=abc")).toEqual({});
    expect(adsClickFromSearch("?gclid=" + encodeURIComponent("a b<script>12345"))).toEqual({});
  });

  it("round-trips through the cookie and ignores other cookies", () => {
    const ids = { gclid: "Cj0KCQiA_abc-123456", seenAt: 1700000000000 };
    const header = `a=1; aee_gads=${encodeAdsClick(ids)}; b=2`;
    expect(readAdsClickFromCookieHeader(header)).toEqual({
      gclid: ids.gclid,
      gbraid: undefined,
      wbraid: undefined,
      seenAt: ids.seenAt,
    });
    expect(decodeAdsClick("garbage|||")).toEqual({});
  });

  it("captureAdsClick never throws, including on a bad URL", () => {
    expect(captureAdsClick("not a url")).toEqual({});
    expect(captureAdsClick("")).toEqual({});
  });
});
