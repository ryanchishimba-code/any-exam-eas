import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aiLogicEngine } from "@/lib/core/ai-logic";

describe("aiLogicEngine.generateQuestionExplanation", () => {
  const sampleInput = {
    stem: "A patient has shortness of breath. What is the priority nursing action?",
    options: ["Start IV fluids", "Assess airway and breathing", "Order a chest X-ray"],
    correctAnswers: ["Assess airway and breathing"],
    selectedAnswers: ["Start IV fluids"],
    explanation: "ABCs — assess airway and breathing before interventions.",
    field: "nursing",
    tags: ["prioritization"],
  };

  let capturedUserPrompt = "";

  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as {
          messages: { role: string; content: string }[];
        };
        capturedUserPrompt = body.messages.find((m) => m.role === "user")?.content ?? "";
        return {
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "Prioritize airway assessment before fluids.",
                    whyCorrect:
                      "Assess airway and breathing first — unstable patients need ABCs before IV access.",
                    whyIncorrect: {
                      "Start IV fluids":
                        "Fluids do not address the immediate threat to airway or breathing.",
                    },
                    keyTakeaways: ["Unstable SOB → ABCs first"],
                    pearls: ["Look, listen, feel before lines and labs"],
                    relatedConcepts: ["prioritization", "respiratory distress"],
                    difficultyLabel: "NCLEX clinical judgment",
                  }),
                },
              },
            ],
          }),
        };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("coaches using the student's selected wrong answer", async () => {
    const { explanation, source } = await aiLogicEngine.generateQuestionExplanation(sampleInput);

    expect(source).toBe("ai");
    expect(capturedUserPrompt).toContain("STUDENT SELECTED");
    expect(capturedUserPrompt).toContain("Start IV fluids");
    expect(explanation.whyIncorrect?.["Start IV fluids"]).toContain("airway");
    expect(explanation.keyTakeaways?.[0]).toContain("ABCs");
  });

  it("falls back when OpenAI is unavailable", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const { source, explanation } = await aiLogicEngine.generateQuestionExplanation({
      ...sampleInput,
      stem: `${sampleInput.stem} (fallback probe ${Date.now()})`,
    });
    expect(source).toBe("fallback");
    expect(explanation.summary.length).toBeGreaterThan(10);
  });
});
