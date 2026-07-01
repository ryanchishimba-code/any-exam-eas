import { describe, expect, it } from "vitest";
import { parseAnatomyAssistActions } from "./assist-actions";

describe("parseAnatomyAssistActions", () => {
  it("parses select and layer actions", () => {
    const actions = parseAnatomyAssistActions([
      { type: "select_structure", structureId: "heart" },
      { type: "toggle_layer", layer: "skin", visible: false },
      { type: "set_system_filter", system: "cardiovascular" },
      { type: "reset_view" },
    ]);
    expect(actions).toEqual([
      { type: "select_structure", structureId: "heart" },
      { type: "toggle_layer", layer: "skin", visible: false },
      { type: "set_system_filter", system: "cardiovascular" },
      { type: "reset_view" },
    ]);
  });

  it("drops invalid entries", () => {
    expect(parseAnatomyAssistActions([{ type: "toggle_layer", layer: "invalid", visible: true }])).toEqual(
      []
    );
  });
});
