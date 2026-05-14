import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksUpdateInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    data: Schema.optional(Schema.Unknown),
    fields: Schema.optional(Schema.Unknown),
    extra_fields: Schema.optional(Schema.Unknown),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::update" }));
export type AdminWebhooksUpdateInput = typeof AdminWebhooksUpdateInput.Type;

// Output Schema
export const AdminWebhooksUpdateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Array(Schema.Unknown));
export type AdminWebhooksUpdateOutput = typeof AdminWebhooksUpdateOutput.Type;

// The operation
/**
 * Update the record. To remove sub records include the _destroy flag
 */
export const AdminWebhooksUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: AdminWebhooksUpdateInput,
  outputSchema: AdminWebhooksUpdateOutput,
}));
