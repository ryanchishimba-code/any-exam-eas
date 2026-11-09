import { describe, expect, it } from "vitest";
import { classifyPassRow } from "@/lib/promo/free-pass";
import {
  FACULTY_ACCESS_CODE,
  FACULTY_ACCESS_DAYS,
  FACULTY_ACCESS_EXPIRES_AT,
  FACULTY_ACCESS_MAX_USES,
  FACULTY_ACCESS_URL,
  isFacultyAccessCode,
  passCodeHelp,
} from "@/lib/promo/faculty-access";

describe("faculty access code", () => {
  it("publishes one shareable signup link", () => {
    expect(FACULTY_ACCESS_URL).toBe("https://www.anyexameasy.com/signup?code=FACULTY30");
    expect(FACULTY_ACCESS_CODE).toBe("FACULTY30");
    expect(FACULTY_ACCESS_DAYS).toBe(30);
    expect(FACULTY_ACCESS_MAX_USES).toBe(50);
    expect(FACULTY_ACCESS_EXPIRES_AT.toISOString()).toBe("2027-05-09T23:59:59.000Z");
  });

  it("tells faculty there is no card and no later charge", () => {
    const help = passCodeHelp(" faculty30 ");
    expect(isFacultyAccessCode("faculty30")).toBe(true);
    expect(help).toContain("No card");
    expect(help).toContain("will not charge you");
    expect(help).toContain("50");
    expect(help).toContain("May 9, 2027");
    expect(help.toLowerCase()).not.toContain("works once");
  });

  it("keeps printed single-use passes distinct", () => {
    expect(passCodeHelp("RN-7K4Q-2M")).toContain("works once");
    expect(passCodeHelp("RN-7K4Q-2M")).toContain("no charge");
  });

  it("still accepts a redemption while uses remain under the cap", () => {
    const decision = classifyPassRow(
      {
        id: "faculty_outreach_2026",
        code: FACULTY_ACCESS_CODE,
        active: true,
        compDays: FACULTY_ACCESS_DAYS,
        audience: "faculty",
        expiryDate: FACULTY_ACCESS_EXPIRES_AT,
        maxUses: FACULTY_ACCESS_MAX_USES,
        currentUses: 49,
      },
      new Date("2026-11-09T12:00:00.000Z")
    );
    expect(decision).toEqual({ ok: true, compDays: 30 });
  });
});
