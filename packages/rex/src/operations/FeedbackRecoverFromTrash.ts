import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackRecoverFromTrashInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Feedback::recoverFromTrash" }),
  );
export type FeedbackRecoverFromTrashInput =
  typeof FeedbackRecoverFromTrashInput.Type;

// Output Schema
export const FeedbackRecoverFromTrashOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type FeedbackRecoverFromTrashOutput =
  typeof FeedbackRecoverFromTrashOutput.Type;

// The operation
/**
 * Recover a record from the trash
 *
 * Recovers a record from the trash
 */
export const FeedbackRecoverFromTrash = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: FeedbackRecoverFromTrashInput,
    outputSchema: FeedbackRecoverFromTrashOutput,
  }),
);
