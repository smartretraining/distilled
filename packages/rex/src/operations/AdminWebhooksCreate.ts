import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksCreateInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    data: Schema.optional(Schema.Unknown),
    return_id: Schema.optional(Schema.Boolean),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::create" }));
export type AdminWebhooksCreateInput = typeof AdminWebhooksCreateInput.Type;

// Output Schema
export const AdminWebhooksCreateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Array(Schema.Unknown));
export type AdminWebhooksCreateOutput = typeof AdminWebhooksCreateOutput.Type;

// The operation
/**
 * Create a record and return a reference to the id
 */
export const AdminWebhooksCreate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: AdminWebhooksCreateInput,
  outputSchema: AdminWebhooksCreateOutput,
}));
