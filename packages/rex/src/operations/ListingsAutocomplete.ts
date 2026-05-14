import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsAutocompleteInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    search_string: Schema.optional(Schema.String),
    listing_states: Schema.optional(Schema.Array(Schema.Unknown)),
    limit: Schema.optional(Schema.Number),
    return_viewstate: Schema.optional(Schema.Boolean),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::autocomplete" }));
export type ListingsAutocompleteInput = typeof ListingsAutocompleteInput.Type;

// Output Schema
export const ListingsAutocompleteOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsAutocompleteOutput = typeof ListingsAutocompleteOutput.Type;

// The operation
/**
 * Optimized for auto complete based on address of a property
 */
export const ListingsAutocomplete = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ListingsAutocompleteInput,
    outputSchema: ListingsAutocompleteOutput,
  }),
);
