import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetDefaultExternalIdInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::getDefaultExternalId" }),
  );
export type ListingsGetDefaultExternalIdInput =
  typeof ListingsGetDefaultExternalIdInput.Type;

// Output Schema
export const ListingsGetDefaultExternalIdOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetDefaultExternalIdOutput =
  typeof ListingsGetDefaultExternalIdOutput.Type;

// The operation
/**
 * Get the default external id that will be used when an inbound xml id is not set on the listing and it hasn't been overridden for a specific portal
 */
export const ListingsGetDefaultExternalId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetDefaultExternalIdInput,
    outputSchema: ListingsGetDefaultExternalIdOutput,
  }));
