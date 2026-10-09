import { describe, expect, it } from "vitest";
import { runTimedSqlQuery } from "./db";

describe("runTimedSqlQuery", () => {
  it("sets a 5s statement timeout and a 2s lock timeout around the caller's SQL", async () => {
    const seen: Array<{ sql: string; values: unknown[] }> = [];
    let signal: AbortSignal | undefined;

    const client = Object.assign(
      (strings: TemplateStringsArray, ...values: unknown[]) => {
        seen.push({ sql: strings.join("?"), values });
        return { kind: "tag" };
      },
      {
        query(text: string, params: unknown[]) {
          seen.push({ sql: text, values: params });
          return { kind: "query" };
        },
        transaction(
          build: (txn: typeof client) => unknown[],
          opts?: { fetchOptions?: { signal?: AbortSignal } }
        ) {
          signal = opts?.fetchOptions?.signal;
          const queries = build(client);
          expect(queries).toHaveLength(3);
          return Promise.resolve([[{ set_config: "5000" }], [{ set_config: "2000" }], [{ count: 12 }]]);
        },
      }
    );

    const rows = await runTimedSqlQuery<Array<{ count: number }>>(
      client,
      'SELECT COUNT(*)::int AS count FROM "QuestionBankItem"',
      [],
      5_000
    );

    expect(rows).toEqual([{ count: 12 }]);
    expect(seen[0]).toEqual({
      sql: "SELECT set_config('statement_timeout', ?, true)",
      values: ["5000"],
    });
    expect(seen[1]).toEqual({
      sql: "SELECT set_config('lock_timeout', ?, true)",
      values: ["2000"],
    });
    expect(seen[2]?.sql).toContain('FROM "QuestionBankItem"');
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(false);
  });
});
