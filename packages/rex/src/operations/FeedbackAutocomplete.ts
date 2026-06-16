import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackAutocompleteInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    search_string: Schema.String,
    limit: Schema.optional(Schema.NullOr(Schema.Number)),
    return_viewstate: Schema.optional(Schema.NullOr(Schema.Boolean)),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Feedback::autocomplete" }));
export type FeedbackAutocompleteInput = typeof FeedbackAutocompleteInput.Type;

// Output Schema
export const FeedbackAutocompleteOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Array(Schema.Unknown));
export type FeedbackAutocompleteOutput = typeof FeedbackAutocompleteOutput.Type;

// The operation
/**
 * Autocomplete a simple search query
 *
 * Autocomplete records on search string
 */
export const FeedbackAutocomplete = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: FeedbackAutocompleteInput,
    outputSchema: FeedbackAutocompleteOutput,
  }),
);
