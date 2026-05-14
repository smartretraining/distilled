import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetLatestVendorLoginEmailsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
    contact_ids: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getLatestVendorLoginEmails",
    }),
  );
export type ListingsGetLatestVendorLoginEmailsInput =
  typeof ListingsGetLatestVendorLoginEmailsInput.Type;

// Output Schema
export const ListingsGetLatestVendorLoginEmailsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetLatestVendorLoginEmailsOutput =
  typeof ListingsGetLatestVendorLoginEmailsOutput.Type;

// The operation
/**
 * Get the most recent vendor login emails sent to contacts for a specific listing
 */
export const ListingsGetLatestVendorLoginEmails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetLatestVendorLoginEmailsInput,
    outputSchema: ListingsGetLatestVendorLoginEmailsOutput,
  }));
