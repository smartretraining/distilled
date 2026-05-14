import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ListingsDescribeModel } from "../src/operations/ListingsDescribeModel.ts";
import { ListingsSearch } from "../src/operations/ListingsSearch.ts";
import { runEffect } from "./setup.ts";
describe("Listings (live)", () => {
  it("describeModel returns the query surface", async () => {
    const model = await runEffect(ListingsDescribeModel({}));
    expect(Array.isArray(model?.orderby_fields)).toBe(true);
    expect((model?.orderby_fields ?? []).length).toBeGreaterThan(0);
    expect(typeof model?.searchable_fields).toBe("object");
  });

  it("search returns listing rows that decode to the generated shape", async () => {
    const page = await runEffect(ListingsSearch({ limit: 3 }))

    expect(Array.isArray(page?.rows)).toBe(true);
    const rows = page?.rows ?? [];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(3);
    expect(typeof page?.total).toBe("number");
    // The operation already ran each row through `ListingsSearchOutput`;
    // assert the decoded field types match what Rex actually returns.
    const row = rows[0]!;
    expect(typeof row.id).toBe("number");
    expect(typeof row.system_listing_state).toBe("string");
    expect(typeof row.system_ctime).toBe("number");
  });

  it("fails (does not resolve) for an invalid argument", async () => {
    // `limit` must be numeric — Rex rejects a bad value, which surfaces as a
    // failed Effect (envelope error via transformResponse / a transport
    // error via matchError). Either way the Exit must not be a success.
    const exit = await runEffect(
      ListingsSearch({ limit: "not-a-number" as unknown as number }).pipe(
        Effect.exit,
      ),
    );

    expect(exit._tag).toBe("Failure");
  });
});
