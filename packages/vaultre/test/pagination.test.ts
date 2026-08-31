import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { describe, expect, it } from "vitest";
import { paginatePages } from "../src/pagination.ts";
import {
  getPropertiesLifeSale,
  getUserTeams,
} from "../src/services/vaultre.ts";
import { json, stubClient } from "./setup.ts";

const trait = {
  inputToken: "page",
  outputToken: "totalPages",
  items: "items",
  pageSize: "pagesize",
} as const;

const pagesOf = <O>(
  respond: (page: number) => O,
  input: Record<string, unknown> = {},
): Promise<{ pages: O[]; requested: number[] }> => {
  const requested: number[] = [];
  const operation = (i: Record<string, unknown>) =>
    Effect.sync(() => {
      const page = i.page as number;
      requested.push(page);
      return respond(page);
    });

  return Effect.runPromise(
    Stream.runCollect(paginatePages(operation, input, trait)),
  ).then((pages) => ({ pages: [...pages] as O[], requested }));
};

describe("VaultRE pagination", () => {
  it("stops on the page totalPages names", async () => {
    const { requested } = await pagesOf((page) => ({
      items: [{ id: page }],
      totalItems: 6,
      totalPages: 3,
    }));

    expect(requested).toEqual([1, 2, 3]);
  });

  it("starts where the caller asked", async () => {
    const { requested } = await pagesOf(
      (page) => ({ items: [{ id: page }], totalPages: 4 }),
      { page: 3 },
    );

    expect(requested).toEqual([3, 4]);
  });

  it("stops on an empty page even when totalPages disagrees", async () => {
    // A record deleted mid-traversal shortens the collection under us; a
    // stale totalPages would otherwise keep asking for pages that are gone.
    const { requested } = await pagesOf((page) => ({
      items: page < 2 ? [{ id: page }] : [],
      totalPages: 9,
    }));

    expect(requested).toEqual([1, 2]);
  });

  it("stops rather than looping when the response carries no page metadata", async () => {
    const { pages, requested } = await pagesOf(() => ({ nothing: "useful" }));

    expect(requested).toEqual([1]);
    expect(pages).toHaveLength(1);
  });

  it("streams items across pages through a generated operation", async () => {
    const stub = stubClient((_call, index) =>
      json({
        items: [{ id: index + 1, status: "listing" }],
        totalItems: 2,
        totalPages: 2,
      }),
    );

    const items = await Effect.runPromise(
      Stream.runCollect(getPropertiesLifeSale.items({ pagesize: 1 })).pipe(
        Effect.provide(stub.layer),
      ),
    );

    expect([...items].map((i) => i.id)).toEqual([1, 2]);
    expect(
      stub.calls.map((c) => new URL(c.url).searchParams.get("page")),
    ).toEqual(["1", "2"]);
  });

  it("leaves the envelope-without-a-page operations unpaginated", async () => {
    // `/user/teams` answers { items, totalItems, totalPages } but takes no
    // `page` parameter. Paginating it would re-request page 1 forever, since
    // a page number the API ignores cannot advance.
    expect("pages" in getUserTeams).toBe(false);
    expect("pages" in getPropertiesLifeSale).toBe(true);
  });
});
