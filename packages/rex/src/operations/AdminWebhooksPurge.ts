import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksPurgeInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::purge" }));
export type AdminWebhooksPurgeInput = typeof AdminWebhooksPurgeInput.Type;

// Output Schema
export const AdminWebhooksPurgeOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type AdminWebhooksPurgeOutput = typeof AdminWebhooksPurgeOutput.Type;

// The operation
/**
 * Truly and fully deletes the record from the database.
 */
export const AdminWebhooksPurge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: AdminWebhooksPurgeInput,
  outputSchema: AdminWebhooksPurgeOutput,
}));
