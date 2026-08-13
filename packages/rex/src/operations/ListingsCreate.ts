import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsCreateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  data: Schema.Struct({
    authority_date_start: Schema.optional(Schema.NullOr(Schema.String)),
    authority_duration_days: Schema.optional(Schema.NullOr(Schema.String)),
    authority_date_expires: Schema.optional(Schema.NullOr(Schema.String)),
    price_advertise_as: Schema.optional(Schema.NullOr(Schema.String)),
    price_rent: Schema.optional(Schema.NullOr(Schema.Number)),
    price_match: Schema.optional(Schema.NullOr(Schema.Number)),
    price_bond: Schema.optional(Schema.NullOr(Schema.Number)),
    price_rent_per_m2: Schema.optional(Schema.NullOr(Schema.Number)),
    price_rent_period_id: Schema.optional(Schema.NullOr(Schema.String)),
    price_rent_tax_id: Schema.optional(Schema.NullOr(Schema.String)),
    available_from_date: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_alarm_code: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_notes: Schema.optional(Schema.NullOr(Schema.String)),
    tenancy_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    outgoings_annual: Schema.optional(Schema.NullOr(Schema.Number)),
    outgoings_rent_is_plus: Schema.optional(Schema.NullOr(Schema.String)),
    meta_highlight_1: Schema.optional(Schema.NullOr(Schema.String)),
    meta_highlight_2: Schema.optional(Schema.NullOr(Schema.String)),
    meta_highlight_3: Schema.optional(Schema.NullOr(Schema.String)),
    meta_other_features: Schema.optional(Schema.NullOr(Schema.String)),
    feedback_offer_level: Schema.optional(Schema.NullOr(Schema.Number)),
    feedback_price_rank: Schema.optional(Schema.NullOr(Schema.Number)),
    feedback_notes: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_lot: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_subdivision: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_address: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_description: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_titleref: Schema.optional(Schema.NullOr(Schema.String)),
    legal_vendor_name: Schema.optional(Schema.NullOr(Schema.String)),
    legal_vendor_residence: Schema.optional(Schema.String),
    inbound_unique_id: Schema.optional(Schema.NullOr(Schema.String)),
    inbound_last_update: Schema.optional(Schema.NullOr(Schema.String)),
    parent_listing_id: Schema.optional(Schema.NullOr(Schema.Number)),
    new_home: Schema.optional(Schema.NullOr(Schema.Boolean)),
    let_agreed: Schema.optional(Schema.NullOr(Schema.Boolean)),
    comm_structure_id: Schema.optional(Schema.NullOr(Schema.String)),
    comm_amount_fixed: Schema.optional(Schema.NullOr(Schema.Number)),
    comm_amount_percentage: Schema.optional(Schema.NullOr(Schema.Number)),
    comm_is_inc_tax: Schema.optional(Schema.NullOr(Schema.Boolean)),
    comm_amount_model_id: Schema.optional(Schema.NullOr(Schema.String)),
    permit_number: Schema.optional(Schema.NullOr(Schema.Number)),
    property: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.Number),
      }),
    ),
    listing_agent_1: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    listing_agent_2: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    legal_solicitor_id: Schema.optional(Schema.NullOr(Schema.Number)),
    project_stage: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    location: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    authority_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    exclusivity: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    listing_category: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.String),
      }),
    ),
    landlord_spend_limit: Schema.optional(Schema.NullOr(Schema.Number)),
    landlord_float: Schema.optional(Schema.NullOr(Schema.Number)),
    landlord_contractor_details: Schema.optional(Schema.NullOr(Schema.String)),
    council_tax_included_in_rent: Schema.optional(
      Schema.NullOr(Schema.Boolean),
    ),
    landlord_has_contractor: Schema.optional(Schema.NullOr(Schema.Boolean)),
    related: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          property_features: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.Struct({
                  feature: Schema.optional(
                    Schema.Struct({
                      id: Schema.optional(Schema.String),
                    }),
                  ),
                }),
              ),
            ),
          ),
        }),
      ),
    ),
  }),
  return_id: Schema.optional(Schema.Boolean),
  options: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::create" }));
export type ListingsCreateInput = typeof ListingsCreateInput.Type;

// Output Schema
export const ListingsCreateOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsCreateOutput = typeof ListingsCreateOutput.Type;

// The operation
/**
 * Create a record and return a reference to the id
 */
export const ListingsCreate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsCreateInput,
  outputSchema: ListingsCreateOutput,
}));
