import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetPropertiesForListingsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_ids: Schema.optional(Schema.Array(Schema.Unknown)),
    listing_viewstate_id: Schema.optional(Schema.Number),
    return_format: Schema.optional(Schema.String),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getPropertiesForListings",
    }),
  );
export type ListingsGetPropertiesForListingsInput =
  typeof ListingsGetPropertiesForListingsInput.Type;

// Output Schema
export const ListingsGetPropertiesForListingsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetPropertiesForListingsOutput =
  typeof ListingsGetPropertiesForListingsOutput.Type;

// The operation
/**
 * Retrieve the ids of properties that correspond to either an array of listing ids or a listing_viewstate_id
 */
export const ListingsGetPropertiesForListings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetPropertiesForListingsInput,
    outputSchema: ListingsGetPropertiesForListingsOutput,
  }));
