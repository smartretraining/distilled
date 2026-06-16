import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackGetContactViewstateForSearchInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.optional(Schema.Array(Schema.Unknown)),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Feedback::getContactViewstateForSearch",
    }),
  );
export type FeedbackGetContactViewstateForSearchInput =
  typeof FeedbackGetContactViewstateForSearchInput.Type;

// Output Schema
export const FeedbackGetContactViewstateForSearchOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackGetContactViewstateForSearchOutput =
  typeof FeedbackGetContactViewstateForSearchOutput.Type;

// The operation
/**
 * Get a contact view state
 */
export const FeedbackGetContactViewstateForSearch =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: FeedbackGetContactViewstateForSearchInput,
    outputSchema: FeedbackGetContactViewstateForSearchOutput,
  }));
