import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackGetListingFiltersInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.optional(Schema.Array(Schema.Unknown)),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Feedback::getListingFilters" }),
  );
export type FeedbackGetListingFiltersInput =
  typeof FeedbackGetListingFiltersInput.Type;

// Output Schema
export const FeedbackGetListingFiltersOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Array(
    Schema.NullOr(
      Schema.Struct({
        id: Schema.optional(Schema.NullOr(Schema.String)),
        formatted_address: Schema.optional(Schema.NullOr(Schema.String)),
      }),
    ),
  );
export type FeedbackGetListingFiltersOutput =
  typeof FeedbackGetListingFiltersOutput.Type;

// The operation
/**
 * Gets a list of listings that have feedback to use for filtering
 */
export const FeedbackGetListingFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: FeedbackGetListingFiltersInput,
    outputSchema: FeedbackGetListingFiltersOutput,
  }),
);
