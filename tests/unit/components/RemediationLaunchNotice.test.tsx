import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RemediationLaunchNotice } from "@/components/study/RemediationLaunchNotice";

describe("RemediationLaunchNotice", () => {
  it("shows an honest Weak areas empty state with a standard-set CTA", () => {
    render(<RemediationLaunchNotice mode="weak_areas" fieldId="nursing" subjectId="pharmacology" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "0 weak areas to drill yet" })).toBeInTheDocument();
    expect(screen.getByText(/at least 2 attempts/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Start a standard set" });
    expect(cta).toHaveAttribute("href", expect.stringContaining("style=standard"));
    expect(cta).toHaveAttribute("href", expect.stringContaining("subjectId=pharmacology"));
    expect(screen.queryByRole("link", { name: "Practice mixed topics" })).toBeNull();
  });

  it("keeps the Review incorrect empty state and its practice CTA", () => {
    render(
      <RemediationLaunchNotice mode="review_incorrect" fieldId="nursing" subjectId="management-of-care" />
    );

    expect(screen.getByRole("heading", { name: "0 incorrect items to review" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a standard set" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice mixed topics" })).toHaveAttribute(
      "href",
      expect.stringContaining("subjectId=__mixed__")
    );
  });
});
