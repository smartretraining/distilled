import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksMarkAsHealthyInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    webhook_id: Schema.Unknown,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::markAsHealthy" }),
  );
export type AdminWebhooksMarkAsHealthyInput =
  typeof AdminWebhooksMarkAsHealthyInput.Type;

// Output Schema
export const AdminWebhooksMarkAsHealthyOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminWebhooksMarkAsHealthyOutput =
  typeof AdminWebhooksMarkAsHealthyOutput.Type;

// The operation
export const AdminWebhooksMarkAsHealthy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: AdminWebhooksMarkAsHealthyInput,
    outputSchema: AdminWebhooksMarkAsHealthyOutput,
  }),
);
