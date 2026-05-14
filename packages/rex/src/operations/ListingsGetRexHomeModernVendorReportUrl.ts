import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetRexHomeModernVendorReportUrlInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    listing_id: Schema.Number,
    date_start: Schema.String,
    date_end: Schema.String,
    group_feedback_by: Schema.String,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getRexHomeModernVendorReportUrl",
    }),
  );
export type ListingsGetRexHomeModernVendorReportUrlInput =
  typeof ListingsGetRexHomeModernVendorReportUrlInput.Type;

// Output Schema
export const ListingsGetRexHomeModernVendorReportUrlOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetRexHomeModernVendorReportUrlOutput =
  typeof ListingsGetRexHomeModernVendorReportUrlOutput.Type;

// The operation
/**
 * Returns the url for the Rex Home modern vendor report
 */
export const ListingsGetRexHomeModernVendorReportUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetRexHomeModernVendorReportUrlInput,
    outputSchema: ListingsGetRexHomeModernVendorReportUrlOutput,
  }));
