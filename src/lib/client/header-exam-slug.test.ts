import { describe, expect, it } from "vitest";
import { headerExamSlug } from "@/lib/client/header-exam-slug";
import { fullExamHref } from "@/lib/routes";

describe("header exam matches the account exam", () => {
  it("keeps the account exam when a stale chip says another board", () => {
    const slug = headerExamSlug("nclex", "pance");
    expect(slug).toBe("nclex");
    expect(fullExamHref(slug!)).toBe("/full-exam/nclex");
  });

  it("uses a chip only before the account exam has loaded", () => {
    expect(headerExamSlug(null, "aanp-fnp")).toBe("aanp-fnp");
    expect(fullExamHref("aanp-fnp")).toBe("/full-exam/aanp-fnp");
  });

  it("uses the account exam when nothing else is stored", () => {
    expect(headerExamSlug("naplex", null)).toBe("naplex");
    expect(fullExamHref("naplex")).toBe("/full-exam/naplex");
  });
});
