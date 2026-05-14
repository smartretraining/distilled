import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsUnlinkInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::unlink" }));
export type ListingsUnlinkInput = typeof ListingsUnlinkInput.Type;

// Output Schema
export const ListingsUnlinkOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsUnlinkOutput = typeof ListingsUnlinkOutput.Type;

// The operation
/**
 * Unlink the listing from other commercial listing
 */
export const ListingsUnlink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsUnlinkInput,
  outputSchema: ListingsUnlinkOutput,
}));
