import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsDuplicateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct(
  {
    id: Schema.Number,
    listing_category_id: Schema.optional(Schema.String),
    contacts: Schema.optional(Schema.Unknown),
    data: Schema.optional(Schema.Array(Schema.Unknown)),
  },
).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::duplicate" }));
export type ListingsDuplicateInput = typeof ListingsDuplicateInput.Type;

// Output Schema
export const ListingsDuplicateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsDuplicateOutput = typeof ListingsDuplicateOutput.Type;

// The operation
/**
 * Creates a duplicate of a listing setting it's state to current, optionally changing it's listing type and omitting contacts
 */
export const ListingsDuplicate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsDuplicateInput,
  outputSchema: ListingsDuplicateOutput,
}));
