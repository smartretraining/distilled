import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsShareRexHomeListingPortalLinkInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
    contact_id: Schema.Number,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::shareRexHomeListingPortalLink",
    }),
  );
export type ListingsShareRexHomeListingPortalLinkInput =
  typeof ListingsShareRexHomeListingPortalLinkInput.Type;

// Output Schema
export const ListingsShareRexHomeListingPortalLinkOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsShareRexHomeListingPortalLinkOutput =
  typeof ListingsShareRexHomeListingPortalLinkOutput.Type;

// The operation
/**
 * Share the link to a listing on the Rex Home Listing Portal with a specified contact (via email)
 */
export const ListingsShareRexHomeListingPortalLink =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsShareRexHomeListingPortalLinkInput,
    outputSchema: ListingsShareRexHomeListingPortalLinkOutput,
  }));
