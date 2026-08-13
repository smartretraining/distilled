import { Cause, Effect, Exit, Stream } from "effect";
import { describe, expect, it } from "vitest";
import {
  getContacts,
  getListing,
  getListings,
  getOffices,
  getStaff,
  getSuburbs,
} from "../src/services/reapit.ts";
import { runEffect } from "./setup.ts";

/**
 * These run against the live Reapit sandbox. They exist to catch the two
 * failure modes that a typecheck cannot: a response that does not DECODE
 * (the vendor document's `integer` page counters would fail here, which is
 * why the generated schemas type them as strings), and an error envelope
 * that does not map to a typed error.
 */
describe("Reapit (live)", () => {
  describe("collections", () => {
    it("getListings decodes a page and its metadata", async () => {
      const page = await runEffect(getListings({ limit: 3 }));

      expect(Array.isArray(page.listings)).toBe(true);
      expect(page.listings!.length).toBeGreaterThan(0);
      expect(page.listings!.length).toBeLessThanOrEqual(3);

      // Page metadata arrives as JSON strings — the schema must not have
      // promised numbers, or this response would not have decoded at all.
      expect(typeof page.items).toBe("string");
      expect(typeof page.current).toBe("string");
      expect(typeof page.last).toBe("string");
      expect(Number(page.items)).toBeGreaterThan(0);
    });

    it("decodes listing ids that are not numeric", async () => {
      const page = await runEffect(getListings({ limit: 3 }));
      const listing = page.listings![0]!;
      // Reapit ids look like "12P0168" / "1stf0142" — anything numeric here
      // would mean the schema is lying about the wire.
      expect(typeof listing.id).toBe("string");
    });

    it("getContacts, getOffices and getStaff decode", async () => {
      const [contacts, offices, staff] = await Promise.all([
        runEffect(getContacts({ limit: 2 })),
        runEffect(getOffices({ limit: 2 })),
        runEffect(getStaff({ limit: 2 })),
      ]);

      expect(contacts.contacts!.length).toBeGreaterThan(0);
      expect(offices.offices!.length).toBeGreaterThan(0);
      expect(staff.staffMembers!.length).toBeGreaterThan(0);
    });
  });

  describe("detail reads", () => {
    it("getListing returns the single-listing envelope", async () => {
      const page = await runEffect(getListings({ limit: 1 }));
      const id = page.listings![0]!.id!;

      const detail = await runEffect(getListing({ listingId: id }));
      expect(detail.listing).toBeDefined();
      expect(detail.listing!.id).toBe(id);
    });
  });

  describe("pagination", () => {
    it("streams across page boundaries without repeating a record", async () => {
      // limit=2 over a collection with thousands of rows: three pages is
      // enough to prove the page counter advances and `last` terminates.
      const pages = await runEffect(
        getListings.pages({ limit: 2 }).pipe(Stream.take(3), Stream.runCollect),
      );

      const collected = Array.from(pages);
      expect(collected.length).toBe(3);

      const ids = collected.flatMap((p) => (p.listings ?? []).map((l) => l.id));
      expect(ids.length).toBe(6);
      expect(new Set(ids).size).toBe(6);
    });

    it("items() flattens the collection", async () => {
      const items = await runEffect(
        getListings.items({ limit: 2 }).pipe(Stream.take(5), Stream.runCollect),
      );
      expect(Array.from(items).length).toBe(5);
    });
  });

  describe("errors", () => {
    it("surfaces an unknown listing id as a typed NotFound failure", async () => {
      const exit = await runEffect(
        getListing({ listingId: "definitely-not-a-listing" }).pipe(Effect.exit),
      );

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        // A typed failure, not a defect — a defect here would mean the
        // error envelope was not recognised.
        expect(Cause.hasDies(exit.cause)).toBe(false);
        const error = Cause.findErrorOption(exit.cause);
        expect(error._tag).toBe("Some");
        if (error._tag === "Some") {
          expect((error.value as { _tag: string })._tag).toBe("NotFound");
        }
      }
    });

    it("surfaces a missing required filter as a typed failure", async () => {
      // `/suburbs` refuses a bare call: "Please specify one of postcode,
      // suburbName, state or region" (HTTP 422).
      const exit = await runEffect(getSuburbs({}).pipe(Effect.exit));

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        expect(Cause.hasDies(exit.cause)).toBe(false);
        const error = Cause.findErrorOption(exit.cause);
        expect(error._tag).toBe("Some");
        if (error._tag === "Some") {
          expect(["UnprocessableEntity", "ReapitApiError"]).toContain(
            (error.value as { _tag: string })._tag,
          );
        }
      }
    });

    it("carries the API's own message through to the typed error", async () => {
      const exit = await runEffect(getSuburbs({}).pipe(Effect.exit));
      if (Exit.isFailure(exit)) {
        const error = Cause.findErrorOption(exit.cause);
        if (error._tag === "Some") {
          const message = (error.value as { message?: string }).message ?? "";
          // The detail sentence, not the bare exception class name.
          expect(message.toLowerCase()).toContain("specify");
        }
      }
    });
  });
});
