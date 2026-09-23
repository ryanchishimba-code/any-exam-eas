import { describe, expect, it } from "vitest";
import {
  appendCampaignUtms,
  hrefLooksLikeSignup,
  pickCampaignUtms,
} from "./campaign-utm";

const META =
  "utm_source=meta&utm_medium=paid&utm_campaign=q4_2026&utm_content=naplex_zeely&utm_term=naplex";

describe("campaign UTM helpers", () => {
  it("picks the five campaign keys and ignores other params", () => {
    expect(pickCampaignUtms(`?${META}&exam=naplex&foo=1`)).toEqual({
      utm_source: "meta",
      utm_medium: "paid",
      utm_campaign: "q4_2026",
      utm_content: "naplex_zeely",
      utm_term: "naplex",
    });
  });

  it("appends inbound UTMs onto a trial signup href", () => {
    const href = appendCampaignUtms(
      "/signup?plan=trial&interval=monthly&tier=pro&exam=naplex",
      META
    );
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("plan")).toBe("trial");
    expect(params.get("exam")).toBe("naplex");
    expect(params.get("utm_source")).toBe("meta");
    expect(params.get("utm_medium")).toBe("paid");
    expect(params.get("utm_campaign")).toBe("q4_2026");
    expect(params.get("utm_content")).toBe("naplex_zeely");
    expect(params.get("utm_term")).toBe("naplex");
  });

  it("does not overwrite UTMs already on the destination", () => {
    const href = appendCampaignUtms(
      "/signup?plan=trial&utm_source=resources",
      "utm_source=meta&utm_campaign=q4_2026"
    );
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("utm_source")).toBe("resources");
    expect(params.get("utm_campaign")).toBe("q4_2026");
  });

  it("merges remembered UTMs when the current URL has none", () => {
    const href = appendCampaignUtms("/signup?plan=trial", "", {
      utm_source: "meta",
      utm_campaign: "q4_2026",
    });
    expect(href).toContain("utm_source=meta");
    expect(href).toContain("utm_campaign=q4_2026");
  });

  it("recognizes signup destinations", () => {
    expect(hrefLooksLikeSignup("/signup?plan=trial")).toBe(true);
    expect(hrefLooksLikeSignup("/naplex")).toBe(false);
  });
});
