export function TrendExhibit({
  exhibit,
}: {
  exhibit?: { title?: string; columns?: unknown; rows?: unknown; note?: string; text?: string } | null;
}) {
  if (!exhibit) return null;
  const columns = Array.isArray(exhibit.columns) ? exhibit.columns.filter((column) => typeof column === "string") : [];
  const rows = Array.isArray(exhibit.rows) ? exhibit.rows : [];
  if (columns.length === 0) {
    return exhibit.text ? (
      <aside className="rounded-3xl bg-[#f4f6f8] p-4">
        {exhibit.title ? <p className="text-sm font-semibold text-[#0A2540]">{exhibit.title}</p> : null}
        <p className="mt-2 text-[15px] leading-6 text-[#0A2540]">{exhibit.text}</p>
      </aside>
    ) : null;
  }
  return (
    <figure className="overflow-x-auto rounded-3xl bg-[#f4f6f8] p-4">
      {exhibit.title ? (
        <figcaption className="mb-3 text-sm font-semibold text-[#0A2540]">{exhibit.title}</figcaption>
      ) : null}
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="border-b border-[#e2e8f0] px-3 py-2 font-semibold text-[#0A2540]">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {(Array.isArray(row) ? row : []).map((cell, cellIndex) => {
                const text = typeof cell === "string" ? cell : String(cell ?? "");
                const Tag = cellIndex === 0 ? "th" : "td";
                return (
                  <Tag
                    key={`${index}-${cellIndex}`}
                    scope={cellIndex === 0 ? "row" : undefined}
                    className="border-b border-[#e2e8f0] px-3 py-2 text-[#0A2540]"
                  >
                    {text}
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {exhibit.note ? <p className="mt-3 text-sm leading-6 text-[#334155]">{exhibit.note}</p> : null}
    </figure>
  );
}
