/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BoardPickerMenuLink } from "@/components/navigation/BoardPickerMenu";

describe("BoardPickerMenuLink", () => {
  it("marks the active board with aria-current and visible check", () => {
    render(
      <BoardPickerMenuLink href="/nclex" label="NCLEX" active role="menuitem" />
    );
    const link = screen.getByRole("menuitem", { name: /nclex/i });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.className).toContain("board-picker-menu-link--active");
  });

  it("uses neutral styling without board accent pill classes", () => {
    render(<BoardPickerMenuLink href="/naplex" label="NAPLEX" />);
    const link = screen.getByRole("link", { name: /naplex/i });
    expect(link.className).not.toContain("aee-board-pill");
    expect(link.className).toContain("board-picker-menu-link");
  });
});
