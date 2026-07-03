import { describe, expect, it } from "vitest";
import { pickerWheelScrollerClassName } from "@/hooks/usePickerWheelScroll";

describe("pickerWheelScrollerClassName", () => {
  it("includes scroll isolation utilities", () => {
    expect(pickerWheelScrollerClassName).toContain("overscroll-y-contain");
    expect(pickerWheelScrollerClassName).toContain("touch-pan-y");
    expect(pickerWheelScrollerClassName).toContain("touch-manipulation");
    expect(pickerWheelScrollerClassName).not.toContain("scroll-smooth");
  });
});
