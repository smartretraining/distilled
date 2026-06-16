import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackDescribeDeleteModesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Feedback::describeDeleteModes" }),
  );
export type FeedbackDescribeDeleteModesInput =
  typeof FeedbackDescribeDeleteModesInput.Type;

// Output Schema
export const FeedbackDescribeDeleteModesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Array(Schema.NullOr(Schema.String));
export type FeedbackDescribeDeleteModesOutput =
  typeof FeedbackDescribeDeleteModesOutput.Type;

// The operation
/**
 * Describes available delete modes
 */
export const FeedbackDescribeDeleteModes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: FeedbackDescribeDeleteModesInput,
    outputSchema: FeedbackDescribeDeleteModesOutput,
  }),
);
