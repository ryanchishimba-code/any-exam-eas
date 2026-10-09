import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const afterCallbacks: Array<() => unknown> = [];
let afterThrows = false;

vi.mock("next/server", () => ({
  after: (cb: () => unknown) => {
    if (afterThrows) throw new Error("`after` was called outside a request scope");
    afterCallbacks.push(cb);
  },
}));

vi.mock("@/lib/database-url", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/database-url")>();
  return {
    ...actual,
    getRuntimeDatabaseUrl: () => "postgresql://u:p@ep-test-pooler.neon.tech/db",
  };
});

const prismaCreate = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: new Proxy(
    {},
    {
      get: () =>
        new Proxy(
          {},
          {
            get: () => prismaCreate,
          }
        ),
    }
  ),
}));

import {
  ACTIVITY_TOUCH_INTERVAL_MS,
  ANALYTICS_CLIENT_TIMEOUT_MS,
  __analyticsWriterTest,
  prepareAnalyticsEvent,
  writePreparedAnalyticsEvent,
} from "./event-writer";
import { trackEvent } from "./events";
import { flushAnalyticsWriteQueue } from "./write-queue";
import { EVENT_TYPES } from "./types";

type Stmt = { text: string; values: unknown[] };

function makeFakeSql(impl?: () => Promise<unknown>) {
  const transactions: Stmt[][] = [];
  const client = {
    transaction: vi.fn(async (build: (txn: unknown) => unknown[]) => {
      const txn = (strings: TemplateStringsArray, ...values: unknown[]) => ({
        text: strings.join("$?").replace(/\s+/g, " ").trim(),
        values,
      });
      const stmts = build(txn) as Stmt[];
      transactions.push(stmts);
      if (impl) return impl();
      return [];
    }),
  };
  return { client, transactions };
}

function questionFetchReq(ua = "Mozilla/5.0 (Macintosh) Chrome/120") {
  return new Request("https://www.anyexameasy.com/api/questions", {
    headers: { "user-agent": ua, "x-forwarded-for": "203.0.113.9" },
  });
}

beforeEach(() => {
  __analyticsWriterTest.resetThrottles();
  afterCallbacks.length = 0;
  afterThrows = false;
  prismaCreate.mockReset();
});

afterEach(() => {
  __analyticsWriterTest.setSqlProvider(null);
  vi.useRealTimers();
});

describe("prepareAnalyticsEvent", () => {
  it("only touches hot per-user rows once per interval per isolate", () => {
    const now = 1_000_000;
    const input = {
      userId: "u1",
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
      req: questionFetchReq(),
    };
    const first = prepareAnalyticsEvent(input, now);
    expect(first.touchUser).toBe(true);
    expect(first.device?.userAgent).toContain("Chrome");

    const second = prepareAnalyticsEvent(input, now + 1_000);
    expect(second.touchUser).toBe(false);
    expect(second.device).toBeNull();
    // The event itself is always recorded (insert-only).
    expect(second.id).not.toBe(first.id);
    expect(second.eventType).toBe(EVENT_TYPES.QUESTION_BANK_FETCH);

    const later = prepareAnalyticsEvent(input, now + ACTIVITY_TOUCH_INTERVAL_MS + 1);
    expect(later.touchUser).toBe(true);
    expect(later.device).not.toBeNull();
  });

  it("never touches User/DeviceHistory for page views or anonymous events", () => {
    const pv = prepareAnalyticsEvent({
      userId: "u1",
      eventType: EVENT_TYPES.PAGE_VIEW,
      req: questionFetchReq(),
    });
    expect(pv.touchUser).toBe(false);
    expect(pv.device).toBeNull();

    const anon = prepareAnalyticsEvent({
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
      req: questionFetchReq(),
    });
    expect(anon.touchUser).toBe(false);
    expect(anon.device).toBeNull();
  });
});

describe("writePreparedAnalyticsEvent", () => {
  it("inserts over Neon HTTP with a short statement/lock timeout and no Prisma", async () => {
    const { client, transactions } = makeFakeSql();
    __analyticsWriterTest.setSqlProvider(async () => client);

    const row = prepareAnalyticsEvent({
      userId: "u1",
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
      metadata: { fieldId: "nclex" },
      req: questionFetchReq(),
    });
    await writePreparedAnalyticsEvent(row);

    expect(prismaCreate).not.toHaveBeenCalled();
    expect(transactions).toHaveLength(2);

    const [insertTxn, touchTxn] = transactions;
    expect(insertTxn[0]!.text).toContain("set_config('statement_timeout'");
    expect(insertTxn[0]!.values).toEqual(["5000"]);
    expect(insertTxn[1]!.text).toContain("set_config('lock_timeout'");
    expect(insertTxn[2]!.text).toContain('INSERT INTO "AnalyticsEvent"');
    expect(insertTxn[2]!.values).toContain(row.id);

    expect(touchTxn[0]!.text).toContain("statement_timeout");
    const userUpdate = touchTxn.find((s) => s.text.includes('UPDATE "User"'));
    expect(userUpdate?.text).toContain('"lastActiveAt" < NOW() -');
    const device = touchTxn.find((s) => s.text.includes('"DeviceHistory"'));
    expect(device?.text).toContain("WHERE NOT EXISTS (SELECT 1 FROM cur)");
    expect(device?.text).toContain('cur."lastSeenAt" < NOW() -');
  });

  it("is insert-only on repeat fetches (no hot-row update)", async () => {
    const { client, transactions } = makeFakeSql();
    __analyticsWriterTest.setSqlProvider(async () => client);
    const input = {
      userId: "u1",
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
      req: questionFetchReq(),
    };
    await writePreparedAnalyticsEvent(prepareAnalyticsEvent(input));
    transactions.length = 0;
    await writePreparedAnalyticsEvent(prepareAnalyticsEvent(input));
    await writePreparedAnalyticsEvent(prepareAnalyticsEvent(input));
    expect(transactions).toHaveLength(2);
    for (const txn of transactions) {
      expect(txn.some((s) => s.text.includes("UPDATE"))).toBe(false);
      expect(txn.at(-1)!.text).toContain('INSERT INTO "AnalyticsEvent"');
    }
  });

  it("makes a single attempt and never throws when the DB errors", async () => {
    const { client } = makeFakeSql(async () => {
      throw new Error("canceling statement due to lock timeout");
    });
    __analyticsWriterTest.setSqlProvider(async () => client);
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const row = prepareAnalyticsEvent({
      userId: "u1",
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
      req: questionFetchReq(),
    });
    await expect(writePreparedAnalyticsEvent(row)).resolves.toBeUndefined();
    // one insert txn + one touch txn, no retries
    expect(client.transaction).toHaveBeenCalledTimes(2);
    errSpy.mockRestore();
  });

  it("gives up on a hung write after the client timeout", async () => {
    vi.useFakeTimers();
    const { client } = makeFakeSql(() => new Promise(() => {}));
    __analyticsWriterTest.setSqlProvider(async () => client);
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const row = prepareAnalyticsEvent({
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
    });
    let settled = false;
    const p = writePreparedAnalyticsEvent(row).then(() => {
      settled = true;
    });
    await vi.advanceTimersByTimeAsync(ANALYTICS_CLIENT_TIMEOUT_MS - 100);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(200);
    await p;
    expect(settled).toBe(true);
    expect(client.transaction).toHaveBeenCalledTimes(1);
    errSpy.mockRestore();
  });
});

describe("trackEvent", () => {
  it("defers the write to after() so the function stays alive until it finishes", async () => {
    const { client, transactions } = makeFakeSql();
    __analyticsWriterTest.setSqlProvider(async () => client);

    trackEvent({
      userId: "u1",
      eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
      req: questionFetchReq(),
    });
    expect(afterCallbacks).toHaveLength(1);
    expect(transactions).toHaveLength(0);

    await afterCallbacks[0]!();
    expect(transactions.length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to the bounded queue outside a request scope", async () => {
    afterThrows = true;
    const { client, transactions } = makeFakeSql();
    __analyticsWriterTest.setSqlProvider(async () => client);

    trackEvent({ eventType: EVENT_TYPES.QUESTION_BANK_FETCH });
    await flushAnalyticsWriteQueue();
    expect(transactions).toHaveLength(1);
  });
});
