import { describe, expect, it } from "vitest";
import {
  compareAreaProgress,
  inviteAfterSkip,
  outcomePromptMode,
  readinessCardMode,
  retakeSuggestion,
} from "@/lib/learning/readiness-check/progress";

const day = (iso: string) => new Date(`${iso}T12:00:00.000Z`);

describe("readiness progress and prompts", () => {
  it("suggests a retake at 14 days and still allows an earlier one to be labeled early", () => {
    const completed = day("2026-09-01");
    expect(retakeSuggestion(completed, day("2026-09-10")).due).toBe(false);
    expect(retakeSuggestion(completed, day("2026-09-10")).daysUntilSuggest).toBe(5);
    expect(retakeSuggestion(completed, day("2026-09-15")).due).toBe(true);
  });

  it("shows improvement from the baseline level without treating missing data as a gain", () => {
    const rows = compareAreaProgress(
      [
        { areaId: "a", label: "Alpha", level: "not_yet" },
        { areaId: "b", label: "Beta", level: "insufficient" },
        { areaId: "c", label: "Gamma", level: "on_track" },
      ],
      [
        { areaId: "a", label: "Alpha", level: "getting_close" },
        { areaId: "b", label: "Beta", level: "on_track" },
        { areaId: "c", label: "Gamma", level: "on_track" },
      ]
    );
    expect(rows[0]).toMatchObject({ movement: "up", detail: "Was Not yet · Now Getting close" });
    expect(rows[1]).toMatchObject({ movement: "new", detail: "Now On track" });
    expect(rows[2]).toMatchObject({ movement: "same", detail: "Still On track" });
  });

  it("asks loudly only after the recorded exam date, and snoozes 'haven't taken it'", () => {
    expect(
      outcomePromptMode({
        examDate: "2026-10-01",
        latest: null,
        now: day("2026-09-25"),
      })
    ).toBe("quiet");

    expect(
      outcomePromptMode({
        examDate: "2026-09-20",
        latest: null,
        now: day("2026-09-25"),
      })
    ).toBe("loud");

    expect(
      outcomePromptMode({
        examDate: "2026-09-20",
        latest: { result: "not_taken", recordedAt: day("2026-09-24"), examDate: "2026-09-20" },
        now: day("2026-09-25"),
      })
    ).toBe("quiet");

    expect(
      outcomePromptMode({
        examDate: "2026-09-20",
        latest: { result: "passed", recordedAt: day("2026-09-21"), examDate: "2026-09-20" },
        now: day("2026-09-25"),
      })
    ).toBe("quiet");
  });

  it("keeps a skipped invite quiet for a week, then offers it again", () => {
    expect(inviteAfterSkip(day("2026-09-24"), day("2026-09-25"))).toBe(false);
    expect(inviteAfterSkip(day("2026-09-10"), day("2026-09-25"))).toBe(true);
    expect(
      readinessCardMode({
        hasInProgress: false,
        hasCompleted: false,
        skippedAt: day("2026-09-24"),
        outcomeLoud: false,
        now: day("2026-09-25"),
      })
    ).toBe("quiet");
  });

  it("puts an exam-day question ahead of an in-progress check", () => {
    expect(
      readinessCardMode({
        hasInProgress: true,
        hasCompleted: true,
        skippedAt: null,
        outcomeLoud: true,
        now: day("2026-09-25"),
      })
    ).toBe("outcome");
  });
});
