import { gradeGuess } from "@/lib/daily-vitals/grade";

export async function POST(request: Request) {
  let body: { date?: unknown; guess?: unknown; attempt?: unknown };
  try {
    body = (await request.json()) as { date?: unknown; guess?: unknown; attempt?: unknown };
  } catch {
    return Response.json(
      { ok: false, message: "That guess did not come through." },
      { status: 400, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
    );
  }

  const result = gradeGuess({
    date: typeof body.date === "string" ? body.date : "",
    guess: typeof body.guess === "string" ? body.guess : "",
    attempt: typeof body.attempt === "number" ? body.attempt : Number(body.attempt),
  });

  return Response.json(result, {
    status: result.ok ? 200 : 400,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
