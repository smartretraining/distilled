import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackTrashInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Feedback::trash" }));
export type FeedbackTrashInput = typeof FeedbackTrashInput.Type;

// Output Schema
export const FeedbackTrashOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Number,
);
export type FeedbackTrashOutput = typeof FeedbackTrashOutput.Type;

// The operation
/**
 * Trash a record - trashed records are like archived records but may be recovered for 30 days after deletion (after which they are purged from the system).
 */
export const FeedbackTrash = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: FeedbackTrashInput,
  outputSchema: FeedbackTrashOutput,
}));
