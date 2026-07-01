import { getOpenAiClient } from "@/lib/openai-client";
import { getAnatomyStructure } from "@/lib/anatomy";
import {
  ANATOMY_LAYER_IDS,
  ANATOMY_SYSTEM_IDS,
  parseAnatomyAssistActions,
  type AnatomyAssistAction,
} from "@/lib/anatomy/assist-actions";
import {
  buildAnatomyAssistContext,
  type AnatomyAssistContextInput,
} from "@/lib/anatomy/assist-context";

export type AnatomyAssistMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AnatomyAssistResult = {
  reply: string;
  actions: AnatomyAssistAction[];
  aiUnavailable?: boolean;
};

const openai = getOpenAiClient("enrichment");

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "anatomy_actions",
      description:
        "Control the 3D anatomy viewer: select a structure, toggle layers, filter by body system, or reset the camera.",
      parameters: {
        type: "object",
        properties: {
          actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "select_structure",
                    "toggle_layer",
                    "set_system_filter",
                    "reset_view",
                  ],
                },
                structureId: { type: "string" },
                layer: { type: "string", enum: [...ANATOMY_LAYER_IDS] },
                visible: { type: "boolean" },
                system: {
                  type: "string",
                  enum: ["all", ...ANATOMY_SYSTEM_IDS],
                },
              },
              required: ["type"],
            },
          },
        },
        required: ["actions"],
      },
    },
  },
];

function sanitizeActions(actions: AnatomyAssistAction[]): AnatomyAssistAction[] {
  return actions.filter((a) => {
    if (a.type === "select_structure") return Boolean(getAnatomyStructure(a.structureId));
    return true;
  });
}

function fallbackReply(
  input: AnatomyAssistContextInput,
  userMessage: string
): AnatomyAssistResult {
  const ctx = buildAnatomyAssistContext(input);
  const selected = input.selectedStructureId
    ? getAnatomyStructure(input.selectedStructureId)
    : null;

  if (selected) {
    return {
      reply: `${selected.name}: ${selected.description} ${selected.clinicalFacts[0] ?? ""}`.trim(),
      actions: [],
      aiUnavailable: true,
    };
  }

  return {
    reply:
      "AI tutor is offline. Select a structure in the 3D model or sidebar to read built-in clinical pearls, or enable OPENAI_API_KEY for interactive tutoring.",
    actions: [],
    aiUnavailable: true,
  };
}

export async function generateAnatomyAssistReply(
  input: AnatomyAssistContextInput,
  history: AnatomyAssistMessage[],
  userMessage: string
): Promise<AnatomyAssistResult> {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return { reply: "Ask a question about the selected structure or a body system.", actions: [] };
  }

  if (!openai) {
    return fallbackReply(input, trimmed);
  }

  const { systemPrompt } = buildAnatomyAssistContext(input);
  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: trimmed },
  ];

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_ANATOMY_MODEL?.trim() || "gpt-4o-mini",
    temperature: 0.35,
    max_tokens: 700,
    messages,
    tools: TOOLS,
    tool_choice: "auto",
  });

  const choice = completion.choices[0];
  let actions: AnatomyAssistAction[] = [];
  let reply = choice?.message?.content?.trim() ?? "";

  const toolCall = choice?.message?.tool_calls?.[0];
  if (toolCall?.type === "function" && toolCall.function.name === "anatomy_actions") {
    try {
      const parsed = JSON.parse(toolCall.function.arguments) as { actions?: unknown };
      actions = sanitizeActions(parseAnatomyAssistActions(parsed.actions));
    } catch {
      /* ignore malformed tool args */
    }
  }

  if (!reply && actions.length > 0) {
    reply = "Updating the 3D view for you.";
  }

  if (!reply) {
    reply = "I couldn't generate a response — try rephrasing your question.";
  }

  return { reply, actions };
}
