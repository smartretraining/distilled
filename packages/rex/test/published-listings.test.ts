import { describe, expect, it } from "vitest";
import { publishedListingsSearch } from "../src/services/rex.ts";
import { runEffect } from "./setup.ts";

describe("PublishedListings (live)", () => {
  it("searches current listings with the Control Centre request shape", async () => {
    const page = await runEffect(
      publishedListingsSearch({
        criteria: [{ system_listing_state: "current" }],
        order_by: { system_ctime: "desc" },
        limit: 3,
        offset: 0,
      }),
    );

    expect(Array.isArray(page?.rows)).toBe(true);
    expect((page?.rows ?? []).length).toBeLessThanOrEqual(3);
    expect(typeof page?.total).toBe("number");

    const row = page?.rows?.[0];
    if (row !== undefined) {
      expect(typeof row.id).toBe("string");
      expect(typeof row.property_id).toBe("string");
      expect(typeof row.system_listing_state).toBe("string");
      expect(row.address === null || typeof row.address === "object").toBe(
        true,
      );
    }
  });
});
