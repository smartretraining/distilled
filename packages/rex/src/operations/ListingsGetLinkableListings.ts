import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetLinkableListingsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    status: Schema.optional(Schema.Array(Schema.Unknown)),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::getLinkableListings" }),
  );
export type ListingsGetLinkableListingsInput =
  typeof ListingsGetLinkableListingsInput.Type;

// Output Schema
export const ListingsGetLinkableListingsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetLinkableListingsOutput =
  typeof ListingsGetLinkableListingsOutput.Type;

// The operation
/**
 * Get possible targets for linking listings
Only applicable for commercial listings
Needed for reaxml uploads, where same commercial listing can be sale and rental at the same time
 *
 * Get possible targets for linking listings
 * Only applicable for commercial listings
 * Needed for reaxml uploads, where same commercial listing can be sale and rental at the same time
 */
export const ListingsGetLinkableListings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ListingsGetLinkableListingsInput,
    outputSchema: ListingsGetLinkableListingsOutput,
  }),
);
