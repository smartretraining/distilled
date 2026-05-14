import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetMatchingMatchProfileIdsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    full_match: Schema.optional(Schema.Boolean),
    cross_account: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getMatchingMatchProfileIds",
    }),
  );
export type ListingsGetMatchingMatchProfileIdsInput =
  typeof ListingsGetMatchingMatchProfileIdsInput.Type;

// Output Schema
export const ListingsGetMatchingMatchProfileIdsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetMatchingMatchProfileIdsOutput =
  typeof ListingsGetMatchingMatchProfileIdsOutput.Type;

// The operation
/**
 * Returns a list of match profiles
 */
export const ListingsGetMatchingMatchProfileIds =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetMatchingMatchProfileIdsInput,
    outputSchema: ListingsGetMatchingMatchProfileIdsOutput,
  }));
