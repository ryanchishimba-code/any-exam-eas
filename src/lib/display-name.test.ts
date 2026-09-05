import { describe, expect, it } from "vitest";
import {
  capitalizeWord,
  displayFirstLastInitial,
  displayFirstName,
  formatDisplayName,
  joinPersonName,
} from "@/lib/display-name";

describe("display-name", () => {
  it("capitalizes words and full names", () => {
    expect(capitalizeWord("ryan")).toBe("Ryan");
    expect(formatDisplayName("ryan chishimba")).toBe("Ryan Chishimba");
    expect(formatDisplayName("  DEV  ")).toBe("Dev");
  });

  it("handles hyphens and apostrophes", () => {
    expect(formatDisplayName("mary-jane o'brien")).toBe("Mary-Jane O'Brien");
  });

  it("derives a capitalized first name", () => {
    expect(displayFirstName("ryan chishimba")).toBe("Ryan");
    expect(displayFirstName(null, "dev.user@example.com")).toBe("Dev");
    expect(displayFirstName()).toBe("there");
  });

  it("formats first name + last initial for admin surfaces", () => {
    expect(displayFirstLastInitial("ryan chishimba")).toBe("Ryan C.");
    expect(displayFirstLastInitial("Mary-Jane O'Brien")).toBe("Mary-Jane O.");
    expect(displayFirstLastInitial("Madonna")).toBe("Madonna");
    expect(displayFirstLastInitial(null, "dev.user@example.com")).toBe("Dev");
  });

  it("joins first and last name for storage", () => {
    expect(joinPersonName("  ryan ", " chishimba ")).toBe("ryan chishimba");
  });
});
