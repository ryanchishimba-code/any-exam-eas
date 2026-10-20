import { describe, expect, it } from "vitest";
import {
  examsMenuAfterClick,
  examsMenuAfterDismiss,
  examsMenuAfterHoverClose,
  examsMenuAfterPointerEnter,
} from "./exams-dropdown-logic";

describe("exams dropdown menu logic", () => {
  it("opens and pins on first click", () => {
    expect(examsMenuAfterClick({ open: false, pinned: false })).toEqual({
      open: true,
      pinned: true,
    });
  });

  it("pins on click when hover already opened the menu", () => {
    expect(examsMenuAfterClick({ open: true, pinned: false })).toEqual({
      open: true,
      pinned: true,
    });
  });

  it("closes on second click when pinned", () => {
    expect(examsMenuAfterClick({ open: true, pinned: true })).toEqual({
      open: false,
      pinned: false,
    });
  });

  it("opens on pointer enter without pinning", () => {
    expect(examsMenuAfterPointerEnter({ open: false, pinned: false })).toEqual({
      open: true,
      pinned: false,
    });
  });

  it("does not close on hover leave when pinned", () => {
    expect(examsMenuAfterHoverClose({ open: true, pinned: true })).toBeNull();
  });

  it("closes on hover leave when not pinned", () => {
    expect(examsMenuAfterHoverClose({ open: true, pinned: false })).toEqual({
      open: false,
      pinned: false,
    });
  });

  it("clears pin on dismiss", () => {
    expect(examsMenuAfterDismiss()).toEqual({ open: false, pinned: false });
  });
});
