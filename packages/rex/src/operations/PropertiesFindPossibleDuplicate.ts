import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesFindPossibleDuplicateInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    property_category_id: Schema.optional(Schema.Number),
    adr_street_number: Schema.optional(Schema.String),
    adr_street_name: Schema.optional(Schema.String),
    adr_suburb_or_town: Schema.optional(Schema.String),
    adr_locality: Schema.optional(Schema.String),
    adr_state_or_region: Schema.optional(Schema.String),
    adr_postcode: Schema.optional(Schema.String),
    adr_unit_number: Schema.optional(Schema.String),
    exclude_ids: Schema.optional(Schema.Array(Schema.Unknown)),
    adr_building_id: Schema.optional(Schema.Unknown),
    skip_postcode_validation: Schema.optional(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Properties::findPossibleDuplicate",
    }),
  );
export type PropertiesFindPossibleDuplicateInput =
  typeof PropertiesFindPossibleDuplicateInput.Type;

// Output Schema
export const PropertiesFindPossibleDuplicateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesFindPossibleDuplicateOutput =
  typeof PropertiesFindPossibleDuplicateOutput.Type;

// The operation
/**
 * Allows for a prevalidation check for a duplicate property (if this function returns something, creation will fail)
 */
export const PropertiesFindPossibleDuplicate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: PropertiesFindPossibleDuplicateInput,
    outputSchema: PropertiesFindPossibleDuplicateOutput,
  }));
