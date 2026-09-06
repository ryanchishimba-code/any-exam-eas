import { describe, expect, it } from "vitest";
import {
  resolveDashboardNextAction,
  weakTopicPracticeHref,
} from "@/components/dashboard/DashboardGraphicHero";

describe("resolveDashboardNextAction", () => {
  it("uses Today as the primary CTA for NCLEX when Mastery Engine is on", () => {
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
    expect(action.label).toBe("Today");
    expect(action.href).toContain("style=today");
    expect(action.href).toContain("field=nursing");
  });

  it("uses Today as the primary CTA for NAPLEX when Mastery Engine is on", () => {
    const action = resolveDashboardNextAction({
      examSlug: "naplex",
      examName: "NAPLEX",
      dueCount: 12,
      topWeakTopic: {
        name: "Cardiology",
        href: weakTopicPracticeHref("naplex", "cardiology", "pharmacy"),
      },
      hasRecent: true,
      practiceFieldId: "pharmacy",
    });
    expect(action.label).toBe("Today");
    expect(action.href).toContain("style=today");
    expect(action.href).toContain("field=pharmacy");
  });

  it("uses Today as the primary CTA for USMLE when Mastery Engine is on", () => {
    const action = resolveDashboardNextAction({
      examSlug: "usmle",
      examName: "USMLE",
      dueCount: 12,
      topWeakTopic: {
        name: "Cardiology",
        href: weakTopicPracticeHref("usmle", "cardiology", "usmle-step-2"),
      },
      hasRecent: true,
      practiceFieldId: "usmle-step-2",
    });
    expect(action.label).toBe("Today");
    expect(action.href).toContain("style=today");
    expect(action.href).toContain("field=usmle-step-2");
  });

  it("still opens weak-topic practice for non-mastery exams", () => {
    const topicHref = weakTopicPracticeHref(
      "pance",
      "cardiology",
      "pance",
      15
    );
    const action = resolveDashboardNextAction({
      examSlug: "pance",
      examName: "PANCE",
      dueCount: 0,
      topWeakTopic: { name: "Cardiology", href: topicHref },
      hasRecent: true,
    });
    expect(action.label).toBe("Strengthen Cardiology");
    expect(action.href).toBe(topicHref);
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
