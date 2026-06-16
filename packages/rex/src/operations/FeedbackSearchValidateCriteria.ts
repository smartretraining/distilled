import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackSearchValidateCriteriaInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Feedback::searchValidateCriteria",
    }),
  );
export type FeedbackSearchValidateCriteriaInput =
  typeof FeedbackSearchValidateCriteriaInput.Type;

// Output Schema
export const FeedbackSearchValidateCriteriaOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackSearchValidateCriteriaOutput =
  typeof FeedbackSearchValidateCriteriaOutput.Type;

// The operation
/**
 * Validates search criteria based on allowable (searchable) fields. If searchable fields provided, uses this, otherwise limited to non restricted search fields.
 */
export const FeedbackSearchValidateCriteria =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: FeedbackSearchValidateCriteriaInput,
    outputSchema: FeedbackSearchValidateCriteriaOutput,
  }));
