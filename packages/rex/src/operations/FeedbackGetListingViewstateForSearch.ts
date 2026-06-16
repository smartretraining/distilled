import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackGetListingViewstateForSearchInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.optional(Schema.Array(Schema.Unknown)),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Feedback::getListingViewstateForSearch",
    }),
  );
export type FeedbackGetListingViewstateForSearchInput =
  typeof FeedbackGetListingViewstateForSearchInput.Type;

// Output Schema
export const FeedbackGetListingViewstateForSearchOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackGetListingViewstateForSearchOutput =
  typeof FeedbackGetListingViewstateForSearchOutput.Type;

// The operation
/**
 * Get a listing view state
 */
export const FeedbackGetListingViewstateForSearch =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: FeedbackGetListingViewstateForSearchInput,
    outputSchema: FeedbackGetListingViewstateForSearchOutput,
  }));
