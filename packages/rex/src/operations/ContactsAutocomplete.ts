import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsAutocompleteInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    search_string: Schema.optional(Schema.String),
    limit_to_contact_type: Schema.optional(Schema.Unknown),
    limit: Schema.optional(Schema.Number),
    return_viewstate: Schema.optional(Schema.Boolean),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::autocomplete" }));
export type ContactsAutocompleteInput = typeof ContactsAutocompleteInput.Type;

// Output Schema
export const ContactsAutocompleteOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsAutocompleteOutput = typeof ContactsAutocompleteOutput.Type;

// The operation
/**
 * Optimized for auto complete based on name of a contact - returns minimal information as required. Will not return any data until 2 characters have been provided
 */
export const ContactsAutocomplete = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsAutocompleteInput,
    outputSchema: ContactsAutocompleteOutput,
  }),
);
