import { crosswordHubPath } from "@/lib/crossword/schedule";

/** Satori needs display:flex on every div that has more than one child. */
export function OgCard({
  kicker,
  title,
  footer,
  cells,
  square = false,
}: {
  kicker: string;
  title: string;
  footer: string;
  cells?: boolean[][];
  square?: boolean;
}) {
  return square ? (
    <SquareCard kicker={kicker} title={title} footer={footer} cells={cells} />
  ) : (
    <WideCard kicker={kicker} title={title} footer={footer} cells={cells} />
  );
}

function Logo() {
  return (
    <svg width="56" height="56" viewBox="0 0 40 40">
      <path d="M6 16.5 20 10l14 6.5-14 6.5L6 16.5Z" fill="#0f766e" />
      <path
        d="M32.5 17.2v7.2c0 2.6-5.4 4.6-12.5 4.6S7.5 27 7.5 24.4v-7.2"
        fill="none"
        stroke="#0f766e"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 22.2 18.2 26l7.3-8.4"
        fill="none"
        stroke="#0f172a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Logo />
      <div
        style={{
          display: "flex",
          marginLeft: 16,
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: -1,
          color: "#0a2540",
        }}
      >
        AnyExamEasy
      </div>
    </div>
  );
}

function WideCard({
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
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: "#f4fbfa",
        color: "#0a2540",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", height: 10, background: "#0f766e" }} />
      <div style={{ display: "flex", flexGrow: 1, flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: cells ? 760 : 1200,
            padding: "42px 36px 36px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Wordmark />
            <div
              style={{
                display: "flex",
                marginTop: 36,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "#0f766e",
              }}
            >
              {kicker}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 12,
                fontSize: title.length > 16 ? 46 : 56,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -1.4,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 24, color: "#475569" }}>{footer}</div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 22, fontWeight: 700, color: "#0f766e" }}>
              {`anyexameasy.com${crosswordHubPath()}`}
            </div>
          </div>
        </div>
        {cells ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            width: 440,
            paddingRight: 48,
            }}
          >
            <CellGrid cells={cells} max={300} />
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 56,
          paddingLeft: 64,
          background: "#0a2540",
          color: "#99f6e4",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        Practice, not a promise you&apos;ll pass
      </div>
    </div>
  );
}

function SquareCard({
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
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        background: "#f4fbfa",
        color: "#0a2540",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", height: 10, background: "#0f766e" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "48px 64px 28px",
        }}
      >
        <Wordmark />
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "#0f766e",
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: title.length > 16 ? 44 : 54,
            fontWeight: 800,
            letterSpacing: -1.2,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 24, color: "#475569" }}>{footer}</div>
        {cells ? (
          <div style={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "center", marginTop: 24 }}>
            <CellGrid cells={cells} max={640} />
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
          padding: "0 64px",
          background: "#0a2540",
          color: "#99f6e4",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex" }}>Practice, not a promise you&apos;ll pass</div>
        <div style={{ display: "flex" }}>anyexameasy.com/crossword</div>
      </div>
    </div>
  );
}

function CellGrid({ cells, max }: { cells: boolean[][]; max: number }) {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const cell = rows && cols ? Math.max(8, Math.min(22, Math.floor(max / Math.max(rows, cols)))) : 0;
  return (
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
  );
}

export function maskFromGrid(grid: string[]): boolean[][] {
  return grid.map((row) => [...row].map((char) => char === "#"));
}
