import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetRexHomeListingPortalPreviewUrlInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getRexHomeListingPortalPreviewUrl",
    }),
  );
export type ListingsGetRexHomeListingPortalPreviewUrlInput =
  typeof ListingsGetRexHomeListingPortalPreviewUrlInput.Type;

// Output Schema
export const ListingsGetRexHomeListingPortalPreviewUrlOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetRexHomeListingPortalPreviewUrlOutput =
  typeof ListingsGetRexHomeListingPortalPreviewUrlOutput.Type;

// The operation
/**
 * Returns the url for an agent to preview the listing in the Rex Home vendor portal
 */
export const ListingsGetRexHomeListingPortalPreviewUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetRexHomeListingPortalPreviewUrlInput,
    outputSchema: ListingsGetRexHomeListingPortalPreviewUrlOutput,
  }));
