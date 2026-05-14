import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetDynamicCommissionEstimateInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
    data_overlay: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getDynamicCommissionEstimate",
    }),
  );
export type ListingsGetDynamicCommissionEstimateInput =
  typeof ListingsGetDynamicCommissionEstimateInput.Type;

// Output Schema
export const ListingsGetDynamicCommissionEstimateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetDynamicCommissionEstimateOutput =
  typeof ListingsGetDynamicCommissionEstimateOutput.Type;

// The operation
/**
 * Get dynamic commission estimate
 */
export const ListingsGetDynamicCommissionEstimate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetDynamicCommissionEstimateInput,
    outputSchema: ListingsGetDynamicCommissionEstimateOutput,
  }));
