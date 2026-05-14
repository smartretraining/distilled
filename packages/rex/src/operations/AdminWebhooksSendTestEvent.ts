import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksSendTestEventInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    webhook_id: Schema.optional(Schema.Unknown),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::sendTestEvent" }),
  );
export type AdminWebhooksSendTestEventInput =
  typeof AdminWebhooksSendTestEventInput.Type;

// Output Schema
export const AdminWebhooksSendTestEventOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminWebhooksSendTestEventOutput =
  typeof AdminWebhooksSendTestEventOutput.Type;

// The operation
/**
 * Sends test event to ensure the webhook works correctly
 */
export const AdminWebhooksSendTestEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: AdminWebhooksSendTestEventInput,
    outputSchema: AdminWebhooksSendTestEventOutput,
  }),
);
