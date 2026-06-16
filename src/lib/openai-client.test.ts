import { afterEach, describe, expect, it } from "vitest";
import {
  allowedOpenAiPurposes,
  isOpenAiPurposeAllowed,
} from "./openai-client";

const ORIGINAL = {
  only: process.env.OPENAI_GENERATION_ONLY,
  allow: process.env.OPENAI_ALLOWED_PURPOSES,
};

afterEach(() => {
  if (ORIGINAL.only === undefined) delete process.env.OPENAI_GENERATION_ONLY;
  else process.env.OPENAI_GENERATION_ONLY = ORIGINAL.only;
  if (ORIGINAL.allow === undefined) delete process.env.OPENAI_ALLOWED_PURPOSES;
  else process.env.OPENAI_ALLOWED_PURPOSES = ORIGINAL.allow;
});

describe("OpenAI purpose gate", () => {
  it("allows every purpose by default", () => {
    delete process.env.OPENAI_GENERATION_ONLY;
    delete process.env.OPENAI_ALLOWED_PURPOSES;
    expect(allowedOpenAiPurposes().size).toBe(6);
    expect(isOpenAiPurposeAllowed("rag")).toBe(true);
    expect(isOpenAiPurposeAllowed("generation")).toBe(true);
  });

  it("restricts to generation when OPENAI_GENERATION_ONLY is set", () => {
    process.env.OPENAI_GENERATION_ONLY = "1";
    expect(isOpenAiPurposeAllowed("generation")).toBe(true);
    expect(isOpenAiPurposeAllowed("repair")).toBe(false);
    expect(isOpenAiPurposeAllowed("curation")).toBe(false);
    expect(isOpenAiPurposeAllowed("rag")).toBe(false);
    expect(isOpenAiPurposeAllowed("enrichment")).toBe(false);
  });

  it("honors an explicit allowlist and always keeps generation on", () => {
    delete process.env.OPENAI_GENERATION_ONLY;
    process.env.OPENAI_ALLOWED_PURPOSES = "repair,curation";
    expect(isOpenAiPurposeAllowed("repair")).toBe(true);
    expect(isOpenAiPurposeAllowed("curation")).toBe(true);
    expect(isOpenAiPurposeAllowed("generation")).toBe(true); // implicit
    expect(isOpenAiPurposeAllowed("rag")).toBe(false);
  });
});
