import { describe, expect, it } from "vitest";
import { splitInlineBold, stripInlineBoldMarkers } from "./inline-bold";

describe("inline bold", () => {
  it("bolds FIRST, PRIORITY, MOST, BEST, and INITIAL and leaves the rest as text", () => {
    expect(
      splitInlineBold(
        "Which action is the **PRIORITY**? Choose the **BEST** **INITIAL** step **FIRST**, the **MOST** urgent."
      )
    ).toEqual([
      { text: "Which action is the ", bold: false },
      { text: "PRIORITY", bold: true },
      { text: "? Choose the ", bold: false },
      { text: "BEST", bold: true },
      { text: " ", bold: false },
      { text: "INITIAL", bold: true },
      { text: " step ", bold: false },
      { text: "FIRST", bold: true },
      { text: ", the ", bold: false },
      { text: "MOST", bold: true },
      { text: " urgent.", bold: false },
    ]);
  });

  it("keeps HTML and other markup as text instead of a document", () => {
    const parts = splitInlineBold(
      'The **PRIORITY** is <script>alert(1)</script> and **<b>BEST</b>** plus *MOST* _INITIAL_.'
    );
    expect(parts).toEqual([
      { text: "The ", bold: false },
      { text: "PRIORITY", bold: true },
      { text: " is <script>alert(1)</script> and ", bold: false },
      { text: "<b>BEST</b>", bold: true },
      { text: " plus *MOST* _INITIAL_.", bold: false },
    ]);
    expect(JSON.stringify(parts)).not.toMatch(/dangerouslySetInnerHTML|innerHTML/);
    expect(stripInlineBoldMarkers("What is the **BEST** <img src=x> action?")).toBe(
      "What is the BEST <img src=x> action?"
    );
  });

  it("leaves unmatched asterisks and empty markers alone", () => {
    expect(splitInlineBold("**PRIORITY")).toEqual([{ text: "**PRIORITY", bold: false }]);
    expect(splitInlineBold("****")).toEqual([{ text: "****", bold: false }]);
    expect(splitInlineBold("")).toEqual([]);
  });
});
