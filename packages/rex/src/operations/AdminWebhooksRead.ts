import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksReadInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct(
  {
    id: Schema.Unknown,
    fields: Schema.optional(Schema.Unknown),
    extra_fields: Schema.optional(Schema.Unknown),
  },
).pipe(T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::read" }));
export type AdminWebhooksReadInput = typeof AdminWebhooksReadInput.Type;

// Output Schema
export const AdminWebhooksReadOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminWebhooksReadOutput = typeof AdminWebhooksReadOutput.Type;

// The operation
export const AdminWebhooksRead = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: AdminWebhooksReadInput,
  outputSchema: AdminWebhooksReadOutput,
}));
