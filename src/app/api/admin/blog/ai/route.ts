import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/admin/auth";
import { getOpenAiClient } from "@/lib/openai-client";
import { BLOG_CATEGORIES } from "@/lib/admin/blog-validators";

export const runtime = "nodejs";
export const maxDuration = 45;

const bodySchema = z.object({
  action: z.enum(["improve_title", "generate_excerpt", "suggest_tags"]),
  title: z.string().max(200).optional().default(""),
  excerpt: z.string().max(500).optional().default(""),
  content: z.string().max(20_000).optional().default(""),
  category: z.string().max(60).optional().default(""),
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** POST /api/admin/blog/ai — Improve title / Generate excerpt / Suggest tags. */
export async function POST(req: Request) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const { action, title, excerpt, content, category } = parsed.data;
  const plain = stripHtml(content).slice(0, 4000);

  const client = getOpenAiClient("enrichment");
  if (!client) {
    return NextResponse.json(localFallback(action, title, excerpt, plain, category));
  }

  try {
    const system =
      "You help write SEO-friendly board-exam prep blog copy for AnyExamEasy. Return JSON only.";
    const user =
      action === "improve_title"
        ? `Improve this blog title for clarity and click-worthiness (max 70 chars). Keep it accurate for ${category || "exam prep"}.\nTitle: ${title}\nExcerpt: ${excerpt}\nBody: ${plain}\nReturn {"title":"..."}`
        : action === "generate_excerpt"
          ? `Write a 1–2 sentence excerpt (max 180 chars) for this post.\nTitle: ${title}\nBody: ${plain}\nReturn {"excerpt":"..."}`
          : `Suggest 4–8 short tags for this post. Prefer exam names and study topics.\nTitle: ${title}\nCategory: ${category}\nBody: ${plain}\nKnown categories: ${BLOG_CATEGORIES.join(", ")}\nReturn {"tags":["..."]}`;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = res.choices[0]?.message?.content ?? "{}";
    const json = JSON.parse(raw) as {
      title?: string;
      excerpt?: string;
      tags?: string[];
    };

    if (action === "improve_title" && json.title) {
      return NextResponse.json({ title: String(json.title).slice(0, 160), source: "ai" });
    }
    if (action === "generate_excerpt" && json.excerpt) {
      return NextResponse.json({
        excerpt: String(json.excerpt).slice(0, 400),
        source: "ai",
      });
    }
    if (action === "suggest_tags" && Array.isArray(json.tags)) {
      return NextResponse.json({
        tags: json.tags.map(String).slice(0, 8),
        source: "ai",
      });
    }
  } catch (err) {
    console.error("[admin/blog/ai] failed", err);
  }

  return NextResponse.json(localFallback(action, title, excerpt, plain, category));
}

function localFallback(
  action: "improve_title" | "generate_excerpt" | "suggest_tags",
  title: string,
  excerpt: string,
  plain: string,
  category: string
) {
  if (action === "improve_title") {
    const improved = title.trim()
      ? `${title.trim().replace(/\?$/, "")}: a practical study guide`
      : "Board exam study tips that actually stick";
    return { title: improved.slice(0, 70), source: "fallback" as const };
  }
  if (action === "generate_excerpt") {
    const base =
      excerpt.trim() ||
      plain.slice(0, 160) ||
      `Practical ${category || "exam"} guidance for focused, high-yield prep.`;
    return { excerpt: base.slice(0, 180), source: "fallback" as const };
  }
  const tags = [
    category || "Study Tips",
    "exam prep",
    "study plan",
    "high yield",
  ].filter(Boolean);
  return { tags, source: "fallback" as const };
}
