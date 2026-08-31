import * as Schema from "effect/Schema";
import { describe, expect, it } from "vitest";
import {
  FeedbackCreateRequest,
  FeedbackCreateResponse,
  PublishedListingsSearchRequest,
  PublishedListingsSearchResponse,
} from "../src/services/rex.ts";

describe("Rex spec translation", () => {
  const decode = Schema.decodeUnknownSync(FeedbackCreateRequest);

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
    expect(() =>
      decode({ data: { related: { feedback_contacts: { contact_id: 3 } } } }),
    ).toThrow();
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
    const out = Schema.decodeUnknownSync(FeedbackCreateResponse);
    expect(out(12345)).toBe(12345);
    expect(out({ id: 1, date_of: "2026-07-27" })).toEqual({
      id: 1,
      date_of: "2026-07-27",
    });
  });

  it("accepts Rex's object-shaped search ordering", () => {
    const decode = Schema.decodeUnknownSync(PublishedListingsSearchRequest);

    expect(
      decode({
        criteria: [{ system_listing_state: "current" }],
        order_by: { system_ctime: "desc" },
        limit: 20,
        offset: 0,
      }).order_by,
    ).toEqual({ system_ctime: "desc" });
    expect(() => decode({ order_by: "system_ctime desc" })).toThrow();
  });

  it("decodes the published-listing slice used by listing imports", () => {
    const decode = Schema.decodeUnknownSync(PublishedListingsSearchResponse);
    const page = decode({
      rows: [
        {
          id: "123",
          etag: "etag-123",
          property_id: "456",
          system_listing_state: "current",
          listing_category_id: "residential_sale",
          price_advertise_as: "$900,000",
          authority_date_start: "2026-08-01",
          authority_date_expires: null,
          authority_duration_days: "90",
          property_category: "House",
          listing_agent_1: {
            id: "7",
            name: "Alex Agent",
            first_name: "Alex",
            last_name: "Agent",
            email_address: "alex@example.com",
            phone_direct: null,
            phone_mobile: "0400000000",
            position: "Sales Agent",
          },
          listing_agent_2: null,
          address: {
            longitude: "153.0251",
            latitude: "-27.4698",
            unit_number: null,
            street_number: "1",
            street_name: "Example Street",
            state_or_region: "QLD",
            locality: null,
            suburb_or_town: "Brisbane City",
            postcode: "4000",
            country: "au",
            estate_name: null,
            estate_stage: null,
            hide_address: "0",
            building: null,
            formats: {
              street_name_number: "1 Example Street",
              street_name_number_w_suburb: "1 Example Street, Brisbane City",
              full_address: "1 Example Street, Brisbane City QLD 4000",
              full_address_w_building_name:
                "1 Example Street, Brisbane City QLD 4000",
              hidden_address: "Brisbane City QLD 4000",
              display_address: "1 Example Street, Brisbane City",
            },
          },
        },
      ],
      total: 1,
    });

    expect(page.rows?.[0]?.listing_agent_1?.id).toBe("7");
    expect(page.rows?.[0]?.address?.formats?.display_address).toBe(
      "1 Example Street, Brisbane City",
    );
  });
});
