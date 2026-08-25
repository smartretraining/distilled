import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { describe, expect, it } from "vitest";
import { nextCursor, paginateAfter } from "../src/pagination.ts";

const trait = {
  inputToken: "after",
  outputToken: "paging.next",
  items: "data",
} as const;

/** Run the strategy over a canned sequence of pages. */
const traverse = (pages: readonly unknown[]) => {
  const seen: Array<string | undefined> = [];
  let index = 0;
  const operation = (input: Record<string, unknown>) => {
    seen.push(input.after as string | undefined);
    return Effect.succeed(pages[index++]);
  };
  return Effect.runPromise(
    Stream.runCollect(paginateAfter(operation, {}, trait)).pipe(
      Effect.map((collected) => ({ pages: [...collected], requested: seen })),
    ),
  );
};

const page = (ids: readonly number[], next?: string) => ({
  data: ids.map((id) => ({ id })),
  ...(next ? { paging: { next } } : {}),
});

const url = (after: string) =>
  `https://acme.boxdice.com.au/ai_api/contacts?after=${after}`;

describe("nextCursor", () => {
  it("extracts the cursor from an absolute next URL", () => {
    expect(nextCursor(url("1520848432_37"))).toBe("1520848432_37");
  });

  // The blueprint's own examples return `next` URLs under /aire_api/ and
  // /rebot_api/ — partner paths a given key may not be provisioned for, and
  // in one case a path naming a different collection than the endpoint that
  // produced it. Taking only the cursor is what makes those harmless.
  it("ignores the path the vendor echoes back, taking only the cursor", () => {
    expect(
      nextCursor(
        "https://acme.boxdice.com.au/rebot_api/rental_listings?after=99_1",
      ),
    ).toBe("99_1");
  });

  // The email and SMS history endpoints page by number rather than cursor.
  it("handles the plain page numbers the history endpoints use", () => {
    expect(nextCursor(url("2"))).toBe("2");
  });

  it.each([
    ["missing", undefined],
    ["null", null],
    ["empty", ""],
    ["cursorless", "https://acme.boxdice.com.au/ai_api/contacts"],
    ["blank cursor", "https://acme.boxdice.com.au/ai_api/contacts?after="],
  ])("returns undefined for a %s next", (_label, value) => {
    expect(nextCursor(value)).toBeUndefined();
  });

  it("falls back to a query scan for a relative next", () => {
    expect(nextCursor("/ai_api/contacts?after=1520848432_37")).toBe(
      "1520848432_37",
    );
  });
});

describe("paginateAfter", () => {
  it("follows cursors across pages", async () => {
    const { pages, requested } = await traverse([
      page([1, 2], url("a")),
      page([3], url("b")),
      page([4]),
    ]);

    expect(pages).toHaveLength(3);
    expect(requested).toEqual([undefined, "a", "b"]);
  });

  // The end of a feed, as the protocol hands it over.
  it("stops on the empty page a 204 becomes", async () => {
    const { pages, requested } = await traverse([
      page([1], url("a")),
      { data: [] },
    ]);

    expect(pages).toHaveLength(2);
    expect(requested).toEqual([undefined, "a"]);
  });

  // Cannot happen per the documented contract; would spin forever if it did.
  it("stops rather than looping when a cursor repeats", async () => {
    const { requested } = await traverse([
      page([1], url("a")),
      page([2], url("a")),
      page([3], url("a")),
    ]);

    expect(requested).toEqual([undefined, "a"]);
  });
});
