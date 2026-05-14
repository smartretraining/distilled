import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesAutocompleteInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    search_string: Schema.optional(Schema.String),
    limit: Schema.optional(Schema.Number),
    return_viewstate: Schema.optional(Schema.Boolean),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::autocomplete" }));
export type PropertiesAutocompleteInput =
  typeof PropertiesAutocompleteInput.Type;

// Output Schema
export const PropertiesAutocompleteOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesAutocompleteOutput =
  typeof PropertiesAutocompleteOutput.Type;

// The operation
/**
 * Optimized for auto complete based on address of a property
 */
export const PropertiesAutocomplete = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: PropertiesAutocompleteInput,
    outputSchema: PropertiesAutocompleteOutput,
  }),
);
