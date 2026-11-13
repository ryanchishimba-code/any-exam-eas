import { crosswordHubPath } from "@/lib/crossword/schedule";

/** Satori needs display:flex on every div that has more than one child. */
export function OgCard({
  kicker,
  title,
  footer,
  cells,
}: {
  kicker: string;
  title: string;
  footer: string;
  cells?: boolean[][];
}) {
  const rows = cells?.length ?? 0;
  const cols = cells?.[0]?.length ?? 0;
  const cell = rows && cols ? Math.max(8, Math.min(16, Math.floor(280 / Math.max(rows, cols)))) : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: "#f4fbfa",
        color: "#0a2540",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: cells ? 760 : 1200,
          height: "100%",
          padding: "56px 48px 48px 64px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#0f766e" }}>{kicker}</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#475569" }}>{footer}</div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 24, fontWeight: 700, color: "#0f766e" }}>
            {`anyexameasy.com${crosswordHubPath()}`}
          </div>
        </div>
      </div>
      {cells ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 440,
            height: "100%",
            paddingRight: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cells.map((row, r) => (
              <div key={`r-${r}`} style={{ display: "flex", flexDirection: "row", marginTop: r === 0 ? 0 : 3 }}>
                {row.map((block, c) => (
                  <div
                    key={`c-${r}-${c}`}
                    style={{
                      width: cell,
                      height: cell,
                      marginLeft: c === 0 ? 0 : 3,
                      background: block ? "#0a2540" : "#0f766e",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function maskFromGrid(grid: string[]): boolean[][] {
  return grid.map((row) => [...row].map((char) => char === "#"));
}
