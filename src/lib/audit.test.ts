import { describe, expect, it, beforeEach } from "vitest";
import { __auditTest } from "@/lib/audit";

describe("admin audit debounce", () => {
  beforeEach(() => {
    __auditTest.clearViewDebounce();
  });

  it("treats VIEW_* as view actions", () => {
    expect(__auditTest.isViewAction("VIEW_ANALYTICS_DASHBOARD")).toBe(true);
    expect(__auditTest.isViewAction("EXPORT_ANALYTICS_CSV")).toBe(false);
    expect(__auditTest.isViewAction("SOCIAL_POST_CANCEL")).toBe(false);
  });

  it("debounces repeated VIEW audits per actor", () => {
    expect(__auditTest.shouldSkipDebouncedView("u1", "VIEW_ANALYTICS_DASHBOARD")).toBe(
      false
    );
    expect(__auditTest.shouldSkipDebouncedView("u1", "VIEW_ANALYTICS_DASHBOARD")).toBe(
      true
    );
    expect(__auditTest.shouldSkipDebouncedView("u2", "VIEW_ANALYTICS_DASHBOARD")).toBe(
      false
    );
    expect(__auditTest.shouldSkipDebouncedView("u1", "VIEW_ANALYTICS_OVERVIEW")).toBe(
      false
    );
  });

  it("does not debounce mutation actions", () => {
    expect(__auditTest.shouldSkipDebouncedView("u1", "EXPORT_ANALYTICS_CSV")).toBe(
      false
    );
    expect(__auditTest.shouldSkipDebouncedView("u1", "EXPORT_ANALYTICS_CSV")).toBe(
      false
    );
  });
});
