import { Cause, Effect, Exit } from "effect";
import { describe, expect, it } from "vitest";
import { RexApiError } from "../src/errors.ts";
import { ListingsDescribeModel } from "../src/operations/ListingsDescribeModel.ts";
import { ListingsRead } from "../src/operations/ListingsRead.ts";
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

  it("surfaces a Rex HTTP-200 envelope error as a typed RexApiError failure", async () => {
    // Reading a non-existent id is a *logical* failure: Rex answers HTTP 200
    // with a non-null `error` in the envelope. The client recovers that into
    // the typed error channel, so the Exit is a typed failure (not a defect)
    // carrying RexApiError — `Effect.catchTag("RexApiError", ...)` would work.
    const exit = await runEffect(
      ListingsRead({ id: 999_999_999 }).pipe(Effect.exit),
    );

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      // It must be a typed failure, not a defect.
      expect(Cause.hasDies(exit.cause)).toBe(false);
      const error = Cause.findErrorOption(exit.cause);
      expect(error._tag).toBe("Some");
      if (error._tag === "Some") {
        expect(error.value).toBeInstanceOf(RexApiError);
      }
    }
  });

  it("recovers a RexApiError via Effect.catchTag", async () => {
    const recovered = await runEffect(
      ListingsRead({ id: 999_999_999 }).pipe(
        Effect.catchTag("RexApiError", (error) =>
          Effect.succeed(`caught: ${error.type ?? "unknown"}`),
        ),
      ),
    );
    expect(recovered).toMatch(/^caught:/);
  });
});
