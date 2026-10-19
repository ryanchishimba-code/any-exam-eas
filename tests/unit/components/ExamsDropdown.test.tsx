/**
 * Exams header menu — click and tap toggle, and the panel stays open.
 *
 *   npx vitest run --project component tests/unit/components/ExamsDropdown.test.tsx
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExamsDropdown } from "@/components/navigation/ExamsDropdown";

const pathname = vi.hoisted(() => vi.fn(() => "/"));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname(),
}));

function setup() {
  render(<ExamsDropdown />);
  const button = screen.getByRole("button", { name: "Exams" });
  return { button };
}

function menu() {
  return document.getElementById("site-exams-menu");
}

function bridge() {
  const panel = menu()?.parentElement;
  if (!panel) throw new Error("missing exams menu bridge");
  return panel;
}

describe("ExamsDropdown", () => {
  beforeEach(() => {
    pathname.mockReturnValue("/");
  });

  it("renders crawlable exam links even while the menu is closed", () => {
    setup();
    const link = screen.getByRole("menuitem", { name: "NCLEX", hidden: true });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/nclex");
    expect(menu()).not.toBeVisible();
  });

  it("toggles open on click and stays open until a real dismiss", () => {
    const { button } = setup();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-controls", "site-exams-menu");

    fireEvent.pointerDown(button, { button: 0, pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(menu()).toBeVisible();

    // The click that follows a pointer press must not immediately close it.
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-expanded", "true");

    // The padding between the button and the panel is part of the menu.
    fireEvent.pointerDown(bridge(), { button: 0, pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerDown(button, { button: 0, pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("does not open or close from hover", () => {
    const { button } = setup();
    fireEvent.mouseEnter(button);
    fireEvent.pointerOver(button);
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.pointerDown(button, { button: 0, pointerType: "mouse" });
    fireEvent.mouseLeave(button);
    fireEvent.pointerOut(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("closes for an outside press, Escape, or a menu link", async () => {
    const user = userEvent.setup();
    const { button } = setup();
    fireEvent.pointerDown(button, { button: 0, pointerType: "mouse" });

    fireEvent.pointerDown(document.body, { button: 0, pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.pointerDown(button, { button: 0, pointerType: "mouse" });
    button.focus();
    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();

    fireEvent.pointerDown(button, { button: 0, pointerType: "mouse" });
    const naplex = screen.getByRole("menuitem", { name: "NAPLEX" });
    expect(naplex.tagName).toBe("A");
    expect(naplex).toHaveAttribute("href", "/naplex");
    naplex.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(naplex);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("stays open on touch when a compatibility mouse event follows the tap", () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { button: 0, pointerType: "touch" });
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button, { detail: 1 });
    fireEvent.pointerDown(document.body, { button: 0, pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerDown(document.body, { button: 0, pointerType: "touch" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("moves through the menu from the keyboard", async () => {
    const user = userEvent.setup();
    const { button } = setup();
    button.focus();
    await user.keyboard("{ArrowDown}");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "NCLEX" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "USMLE" })).toHaveFocus();

    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "NPTE-PT" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("menuitem", { name: "NCLEX" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("opens from the keyboard on Enter and closes on a second Enter", async () => {
    const user = userEvent.setup();
    const { button } = setup();
    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "NCLEX" })).toHaveFocus();

    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
