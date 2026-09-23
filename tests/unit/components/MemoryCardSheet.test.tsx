import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryCardSheet } from "@/components/library/MemoryCardSheet";
import type { MemoryCard } from "@/lib/library/types";

const pearl: MemoryCard = {
  id: "nclex-abc",
  examSlug: "nclex",
  subject: "Management of Care",
  topic: "Prioritization",
  title: "ABC Before Everything",
  teaser: "Airway, breathing, circulation — then the rest.",
  kind: "pearl",
  tags: ["ABC", "priority"],
  body: "Secure the airway before moving on.",
  practiceTopicSlug: "prioritization",
  reviewModuleSlug: "abc-before-everything",
  sourceLabel: "NCLEX board-review memory card",
  lastReviewedAt: "2026-09-01",
  sortOrder: 1,
};

const related: MemoryCard = {
  ...pearl,
  id: "nclex-red-flags",
  title: "See First Red Flags",
  teaser: "Unstable findings outrank routine tasks.",
  sortOrder: 2,
};

describe("MemoryCardSheet study tokens", () => {
  it("ports the sheet onto study-accent and study-surface tokens", () => {
    render(
      <MemoryCardSheet
        card={pearl}
        allCards={[pearl, related]}
        examSlug="nclex"
        open
        onClose={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog", { name: "ABC Before Everything" });
    const portal = dialog.parentElement;
    expect(portal?.className).toContain("study-home-accent");
    expect(dialog.className).toContain("--db-card");
    expect(dialog.className).toContain("--color-surface-elevated");

    const kind = screen.getByText("Pearls");
    expect(kind.className).toContain("--study-accent");
    expect(kind.className).not.toMatch(/indigo|violet|purple/);

    for (const label of ["ABC", "priority"]) {
      const tag = screen.getByText(label);
      expect(tag.className).toContain("--color-surface");
      expect(tag.className).not.toMatch(/indigo|violet|purple/);
    }

    const reveal = screen.getByRole("button", { name: "Reveal answer" });
    expect(reveal.className).toContain("study-home-accent");
    expect(reveal.className).toContain("--study-accent-on");
    expect(reveal.className).toContain("--color-accent");

    const practice = screen.getByRole("link", { name: "Practice Questions" });
    expect(practice.className).toContain("study-home-accent");
    expect(practice.className).toContain("--study-accent-on");

    const deepDive = screen.getByRole("link", { name: "Deep Dive — Review Module" });
    expect(deepDive.className).toContain("study-home-accent");
    expect(deepDive.className).toContain("--db-card");
    expect(deepDive.className).toContain("--color-accent");

    expect(screen.getByText("Card").className).toContain("--study-accent");
    expect(screen.getByRole("button", { name: /See First Red Flags/ })).toBeInTheDocument();

    const markup = portal?.innerHTML ?? "";
    expect(markup).not.toMatch(/indigo-|violet-|purple-|text-white|shadow-apple-btn|#4f46e5/);
  });

  it("still reveals the answer without changing the action", async () => {
    const user = userEvent.setup();
    render(
      <MemoryCardSheet
        card={pearl}
        allCards={[pearl]}
        examSlug="nclex"
        open
        onClose={vi.fn()}
      />
    );

    expect(screen.queryByText("Secure the airway before moving on.")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reveal answer" }));
    expect(screen.getByText("Secure the airway before moving on.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide answer" })).toBeInTheDocument();
  });
});
