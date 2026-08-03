import { ImageResponse } from "next/og";
import {
  getQotdForExam,
  isQotdExamSlug,
  parseQotdDate,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG } from "@/lib/edtech/exams";

const size = { width: 1200, height: 630 };

type Props = { params: Promise<{ exam: string; date: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { exam, date } = await params;

  const fallback = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A2540",
        color: "#fff",
        fontSize: 48,
        fontWeight: 700,
      }}
    >
      AnyExamEasy
    </div>
  );

  if (!isQotdExamSlug(exam) || !parseQotdDate(date)) {
    return new ImageResponse(fallback, { ...size });
  }

  const item = getQotdForExam(exam, date);
  const name = EXAM_CATALOG[exam].shortName;
  const stem =
    item.stem.length > 220 ? `${item.stem.slice(0, 217).trimEnd()}…` : item.stem;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(145deg, #071a2c 0%, #0A2540 48%, #0d3254 100%)",
          color: "#ffffff",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              AnyExamEasy
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `2px solid ${item.examColor}`,
                backgroundColor: `${item.examColor}33`,
                color: item.examColor,
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {name}
            </div>
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {`Question of the Day · ${date}`}
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.28,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
            }}
          >
            {stem}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 28,
            fontSize: 24,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          <div style={{ display: "flex" }}>Answer free · no account needed</div>
          <div style={{ display: "flex", fontWeight: 700, color: "#00D4C8" }}>
            Try free at anyexameasy.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
