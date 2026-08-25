import * as Schema from "effect/Schema";
import { describe, expect, it } from "vitest";
import {
  Contact,
  CreateTasksResponse,
  ListContactsResponse,
  ListPropertiesResponse,
  ListSalesListingsResponse,
  SalesListing,
} from "../src/services/boxdice.ts";
import { normaliseEmptyBody } from "../src/protocol.ts";

/**
 * These decode the payloads Box+Dice's own blueprint documents.
 *
 * They are the only check available on the response side until a tenant key
 * exists: the schemas were transcribed from prose, so the thing worth proving
 * is that they ACCEPT what the vendor says it sends. A schema that rejects a
 * documented payload is a sync outage, and nothing else in this package would
 * catch it.
 *
 * Fixtures are copied from specs/boxdice-ai.apib with its JSON errors
 * corrected (two request bodies there have unterminated keys, and several
 * examples carry trailing commas) — the DATA is the vendor's, the syntax is
 * not.
 */
describe("Box+Dice response decoding", () => {
  it("decodes a sales listing including the full commission voucher", () => {
    const decode = Schema.decodeUnknownSync(ListSalesListingsResponse);

    const page = decode({
      data: [
        {
          id: 7,
          status: "settled",
          consultant_ids: [12],
          primary_consultant_id: 12,
          listing_type: "PRIVATE SALE",
          hidden: false,
          price_undisclosed: false,
          under_offer: false,
          description: "",
          url: "https://your-listing-url.com",
          price_from: 0,
          price_to: 0,
          display_price: "Offers Above $395,000",
          listed_date: "2021-10-01",
          property: {
            id: 17,
            type: "Residential",
            number: "46",
            street_name: "York",
            suburb: "TAHMOOR",
            postcode: "2573",
            state: "NSW",
            latitude: -34.218655,
            beds: 3,
          },
          voucher: {
            sale_date: "2015-03-16",
            sale_price: "431000.0",
            commission_type: "tiered",
            commission_structures: [
              { percentage: 10.0, amount: 0.0, target: 1.0 },
            ],
            gross_commission: { inc_gst: 0.11, ex_gst: 0.1 },
            multiple_payment_stages: false,
            commission_payment_milestones: [
              {
                id: 2,
                stage_type: "DEPOSIT_RELEASE",
                percentage: 100.0,
                amount: 0.1,
                consultant_commissions: [
                  {
                    id: 7,
                    role: "LIST",
                    consultant_id: 2,
                    comm_intro_at: "2023-09-11T15:04:55.000+10:00",
                    comm_intro_amount: "0.0",
                    name: "consultant1 one",
                    office_id: 1,
                    percentage: 50.0,
                    amount: 0.05,
                    consultant: {
                      id: 2,
                      commission_split_type: "simple_target",
                      cumulative_commission_introduced: "0.0",
                      commission_targets: [],
                    },
                    deductions: [],
                  },
                ],
                office_commissions: [
                  {
                    id: 2,
                    office_id: 1,
                    percentage: 50.0,
                    deductions: [
                      {
                        id: 19,
                        description: "",
                        office_commission_id: 2,
                        reasonid_fk: 7,
                        fixed_price: false,
                        criteria: "AFTER",
                        name: "Advertising",
                        amount: 0.0,
                        percentage: 1.0,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          buyers: [
            {
              contact_id: 85,
              interest_level: "MAYBE",
              source: "REA Lead",
              enquiry_date: "2022-03-09T13:29:43+00:00",
              comments: [
                {
                  id: 14,
                  consultant_id: 12,
                  text: "Comment text",
                  type: "EMAIL",
                },
              ],
            },
          ],
          vendor_ids: [11],
          purchaser_ids: [420],
          files: [
            {
              id: 1239,
              name: "SOI.pdf",
              description: "SOI",
              url: "https://example.com/x",
            },
          ],
        },
      ],
      paging: {
        next: "https://acme.boxdice.com.au/ai_api/sales_listings?after=1520848432_37",
      },
    });

    expect(page.data?.[0]?.id).toBe(7);
    // The two members the blueprint contradicts itself about survive as
    // `unknown` rather than failing the decode — see `unresolved()` in
    // scripts/build-spec.ts.
    expect(page.data?.[0]?.voucher?.sale_price).toBe("431000.0");
  });

  // The same members typed as documented (numbers) rather than as observed.
  // Both must decode, because we do not yet know which one the wire sends.
  it("decodes a voucher whose contradicted members take the DOCUMENTED type", () => {
    const decode = Schema.decodeUnknownSync(SalesListing);
    const listing = decode({
      id: 7,
      voucher: { sale_price: 431000.0 },
    });
    expect(listing.voucher?.sale_price).toBe(431000);
  });

  // The collection example returns `{ id: 7, status: "deleted" }` alongside
  // full records. A required member anywhere on Contact would fail here, and
  // deletions are exactly what a sync must not drop.
  it("decodes a tombstoned contact beside a full one", () => {
    const decode = Schema.decodeUnknownSync(ListContactsResponse);
    const page = decode({
      data: [
        {
          id: 6,
          consultant_id: 1,
          first_name: "Josh",
          last_name: "Support",
          company: false,
          created_at: "2019-01-03T11:44:33+11:00",
          address: {
            id: 10,
            number: "730",
            suburb: "OAKDALE",
            latitude: -34.0889811,
          },
          categories: [
            { id: 87, type_id: 4, consultant_id: 3, name: "Foo Bar" },
          ],
          notes: [{ id: 967, consultant_id: 3, text: "Foo bar" }],
          criteria: [
            {
              id: 177,
              type: "sales",
              suburbs: [{ name: "HOBART", postcode: "7000", state: "TAS" }],
              property_type_ids: [],
              price_from: 550000,
            },
          ],
        },
        { id: 7, status: "deleted" },
      ],
      paging: {
        next: "https://acme.boxdice.com.au/ai_api/contacts?after=1520848432_37",
      },
    });

    expect(page.data?.[1]).toEqual({ id: 7, status: "deleted" });
  });

  // The end-of-feed 204. Core promotes `data` to required on paginated
  // operations, so the bare `{}` an empty body decodes to would fail — the
  // protocol substitutes an empty page first. This asserts the composed path,
  // because that is the one a caught-up sync run actually takes.
  it("decodes the empty body a 204 leaves behind, via the protocol's repair", () => {
    const page = Schema.decodeUnknownSync(ListContactsResponse)(
      normaliseEmptyBody({}),
    );
    expect(page.data).toEqual([]);
  });

  it("leaves a populated body alone", () => {
    expect(normaliseEmptyBody({ data: [{ id: 1 }] })).toEqual({
      data: [{ id: 1 }],
    });
  });

  // The properties example sends `null` for members the attribute list types
  // as plain `(String)`.
  it("decodes explicit nulls on documented-as-non-null members", () => {
    const page = Schema.decodeUnknownSync(ListPropertiesResponse)({
      data: [
        {
          id: 89,
          unit: null,
          number: "82",
          postcode: "",
          type: null,
          category: null,
          beds: 0,
        },
      ],
    });
    expect(page.data?.[0]?.type).toBeNull();
  });

  // createTasks answers with a naked array whose entries are `{ id }` OR
  // `{ errors }` positionally — a 200 here does not mean every task landed.
  it("decodes the mixed success/failure array createTasks returns", () => {
    const result = Schema.decodeUnknownSync(CreateTasksResponse)([
      { id: 7352 },
      { errors: { consultant: ["can't be blank"] } },
    ]);
    expect(result).toHaveLength(2);
  });

  it("decodes a contact carrying only an id", () => {
    expect(Schema.decodeUnknownSync(Contact)({ id: 1 })).toEqual({ id: 1 });
  });
});
