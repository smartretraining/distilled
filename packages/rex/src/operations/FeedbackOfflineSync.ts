import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackOfflineSyncInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Unknown,
    open_home: Schema.Unknown,
    contact: Schema.Unknown,
    feedback: Schema.optional(Schema.Unknown),
    retry_count: Schema.optional(Schema.Unknown),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Feedback::offlineSync" }));
export type FeedbackOfflineSyncInput = typeof FeedbackOfflineSyncInput.Type;

// Output Schema
export const FeedbackOfflineSyncOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackOfflineSyncOutput = typeof FeedbackOfflineSyncOutput.Type;

// The operation
export const FeedbackOfflineSync = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: FeedbackOfflineSyncInput,
  outputSchema: FeedbackOfflineSyncOutput,
}));
