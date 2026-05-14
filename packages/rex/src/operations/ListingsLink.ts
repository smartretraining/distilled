import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsLinkInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Unknown,
  related_listing_id: Schema.Unknown,
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::link" }));
export type ListingsLinkInput = typeof ListingsLinkInput.Type;

// Output Schema
export const ListingsLinkOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsLinkOutput = typeof ListingsLinkOutput.Type;

// The operation
/**
 * Link one listing to another
Only applicable for commercial listings
Needed for reaxml uploads, where same commercial listing can be sale and rental at the same time
 *
 * Link one listing to another
 * Only applicable for commercial listings
 * Needed for reaxml uploads, where same commercial listing can be sale and rental at the same time
 */
export const ListingsLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsLinkInput,
  outputSchema: ListingsLinkOutput,
}));
