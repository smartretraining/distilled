import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksSearchInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.optional(Schema.Unknown),
    order_by: Schema.optional(Schema.String),
    offset: Schema.optional(Schema.Number),
    limit: Schema.optional(Schema.Number),
    create_viewstate: Schema.optional(Schema.Boolean),
    result_format: Schema.optional(Schema.String),
    extra_options: Schema.optional(Schema.Array(Schema.Unknown)),
    search_state: Schema.optional(Schema.Unknown),
    ids_only: Schema.optional(Schema.Boolean),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::search" }));
export type AdminWebhooksSearchInput = typeof AdminWebhooksSearchInput.Type;

// Output Schema
export const AdminWebhooksSearchOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Array(Schema.Unknown));
export type AdminWebhooksSearchOutput = typeof AdminWebhooksSearchOutput.Type;

// The operation
/**
 * Perform a search
 */
export const AdminWebhooksSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: AdminWebhooksSearchInput,
  outputSchema: AdminWebhooksSearchOutput,
}));
