import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsSearchValidateCriteriaInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::searchValidateCriteria",
    }),
  );
export type ListingsSearchValidateCriteriaInput =
  typeof ListingsSearchValidateCriteriaInput.Type;

// Output Schema
export const ListingsSearchValidateCriteriaOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsSearchValidateCriteriaOutput =
  typeof ListingsSearchValidateCriteriaOutput.Type;

// The operation
/**
 * Validates search criteria based on allowable (searchable) fields. If searchable fields provided, uses this, otherwise limited to non restricted search fields.
 */
export const ListingsSearchValidateCriteria =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsSearchValidateCriteriaInput,
    outputSchema: ListingsSearchValidateCriteriaOutput,
  }));
