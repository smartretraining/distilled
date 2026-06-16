import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackUpdateApprovalStatusInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    status: Schema.String,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Feedback::updateApprovalStatus" }),
  );
export type FeedbackUpdateApprovalStatusInput =
  typeof FeedbackUpdateApprovalStatusInput.Type;

// Output Schema
export const FeedbackUpdateApprovalStatusOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackUpdateApprovalStatusOutput =
  typeof FeedbackUpdateApprovalStatusOutput.Type;

// The operation
/**
 * Change the state of the feedback entry
 */
export const FeedbackUpdateApprovalStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: FeedbackUpdateApprovalStatusInput,
    outputSchema: FeedbackUpdateApprovalStatusOutput,
  }));
