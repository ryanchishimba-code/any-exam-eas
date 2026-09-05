import { describe, expect, it } from "vitest";
import {
  resolveDashboardNextAction,
  weakTopicPracticeHref,
} from "@/components/dashboard/DashboardGraphicHero";

describe("resolveDashboardNextAction", () => {
  it("prioritizes spaced review when due", () => {
    const action = resolveDashboardNextAction({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      dueCount: 12,
      topWeakTopic: {
        name: "Fluids",
        href: weakTopicPracticeHref("nclex", "fluids-electrolytes"),
      },
      hasRecent: true,
    });
    expect(action.label).toContain("Review 12 due");
    expect(action.href).toContain("style=adaptive");
    expect(action.href).toContain("field=nursing");
  });

  it("opens the weak topic bank — not spaced review — when nothing is due", () => {
    const topicHref = weakTopicPracticeHref(
      "nclex",
      "physiological-adaptation",
      "nursing",
      15
    );
    const action = resolveDashboardNextAction({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      dueCount: 0,
      topWeakTopic: { name: "Physiological Adaptation", href: topicHref },
      hasRecent: true,
    });
    expect(action.label).toBe("Strengthen Physiological Adaptation");
    expect(action.href).toBe(topicHref);
    expect(action.href).toContain("subjectId=physiological-adaptation");
    expect(action.href).not.toContain("style=review");
  });

  it("scopes USMLE practice to the user's step field", () => {
    const href = weakTopicPracticeHref(
      "usmle",
      "cardiology",
      "usmle-step-3",
      15
    );
    expect(href).toContain("field=usmle-step-3");
    expect(href).toContain("subjectId=cardiology");
  });
});
