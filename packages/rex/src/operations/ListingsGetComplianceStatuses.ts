import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetComplianceStatusesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Unknown,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::getComplianceStatuses" }),
  );
export type ListingsGetComplianceStatusesInput =
  typeof ListingsGetComplianceStatusesInput.Type;

// Output Schema
export const ListingsGetComplianceStatusesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetComplianceStatusesOutput =
  typeof ListingsGetComplianceStatusesOutput.Type;

// The operation
export const ListingsGetComplianceStatuses =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetComplianceStatusesInput,
    outputSchema: ListingsGetComplianceStatusesOutput,
  }));
