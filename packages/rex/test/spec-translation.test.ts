import * as Schema from "effect/Schema";
import { describe, expect, it } from "vitest";
import { FeedbackCreateInput, FeedbackCreateOutput } from "../src/operations/FeedbackCreate.ts";

// These guard the three ways Rex's self-description misleads `build-openapi.ts`.
// Every one of them shipped a client that could not make the call at all, and
// nothing caught it because the rest of the suite needs live credentials.
describe("Rex spec translation", () => {
  const decode = Schema.decodeUnknownSync(FeedbackCreateInput);

  // Rex declares `listing`/`agent`/`project`/`project_stage` as `type: "object"`
  // carrying an `items` block, which read as an array and generated
  // `Schema.Array`. Rex's own documented example sends a bare object.
  it("accepts the object-shaped relations Rex documents", () => {
    const input = decode({
      data: {
        date_of: "2026-07-27",
        feedback_type: { id: "enquiry" },
        listing: { id: 1 },
        agent: { id: 2 },
        related: { feedback_contacts: [{ contact_id: 3 }] },
      },
      return_id: true,
    });
    expect(input.data.listing).toEqual({ id: 1 });
    expect(input.data.agent).toEqual({ id: 2 });
  });

  it("rejects the array shape the broken translation produced", () => {
    expect(() => decode({ data: { listing: [{ id: 1 }] } })).toThrow();
  });

  // `related.feedback_contacts` is a genuine array (`type: "array"` + `items`)
  // and must not be collateral damage of the fix above.
  it("keeps genuine arrays as arrays", () => {
    expect(() => decode({ data: { related: { feedback_contacts: { contact_id: 3 } } } })).toThrow();
  });

  // Valuelist ids are strings on the wire — slugs for global lists, numeric
  // strings for per-account ones — however Rex declares them.
  it("accepts string valuelist ids, slug and numeric alike", () => {
    const input = decode({
      data: {
        feedback_type: { id: "enquiry" },
        interest_level: { id: "warm" },
        enquiry_source: { id: "189" },
      },
    });
    expect(input.data.interest_level).toEqual({ id: "warm" });
    expect(input.data.enquiry_source).toEqual({ id: "189" });
  });

  // `return_id` switches the response between a bare id and the whole record.
  // Inferring the record struct made the id half undecodable.
  it("decodes both halves of the return_id response", () => {
    const out = Schema.decodeUnknownSync(FeedbackCreateOutput);
    expect(out(12345)).toBe(12345);
    expect(out({ id: 1, date_of: "2026-07-27" })).toEqual({ id: 1, date_of: "2026-07-27" });
  });
});
