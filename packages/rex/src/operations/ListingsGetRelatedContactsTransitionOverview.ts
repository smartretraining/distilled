import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetRelatedContactsTransitionOverviewInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
    system_contacts_only: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getRelatedContactsTransitionOverview",
    }),
  );
export type ListingsGetRelatedContactsTransitionOverviewInput =
  typeof ListingsGetRelatedContactsTransitionOverviewInput.Type;

// Output Schema
export const ListingsGetRelatedContactsTransitionOverviewOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetRelatedContactsTransitionOverviewOutput =
  typeof ListingsGetRelatedContactsTransitionOverviewOutput.Type;

// The operation
/**
 * Get a map of related contact transitions
 */
export const ListingsGetRelatedContactsTransitionOverview =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetRelatedContactsTransitionOverviewInput,
    outputSchema: ListingsGetRelatedContactsTransitionOverviewOutput,
  }));
