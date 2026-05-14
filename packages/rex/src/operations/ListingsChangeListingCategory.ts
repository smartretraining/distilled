import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsChangeListingCategoryInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Unknown,
    listing_category_id: Schema.Unknown,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::changeListingCategory" }),
  );
export type ListingsChangeListingCategoryInput =
  typeof ListingsChangeListingCategoryInput.Type;

// Output Schema
export const ListingsChangeListingCategoryOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsChangeListingCategoryOutput =
  typeof ListingsChangeListingCategoryOutput.Type;

// The operation
/**
 * Change a DRAFT listing from one category to another (NOT CURRENTLY SUPPORTED)
 */
export const ListingsChangeListingCategory =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsChangeListingCategoryInput,
    outputSchema: ListingsChangeListingCategoryOutput,
  }));
