import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsUpdateArchivedStateDetailsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    details: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::updateArchivedStateDetails",
    }),
  );
export type ListingsUpdateArchivedStateDetailsInput =
  typeof ListingsUpdateArchivedStateDetailsInput.Type;

// Output Schema
export const ListingsUpdateArchivedStateDetailsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsUpdateArchivedStateDetailsOutput =
  typeof ListingsUpdateArchivedStateDetailsOutput.Type;

// The operation
/**
 * Allows you to update date, reason_id, reason_note, lost_agency_id, value_price, value_deposit after having converted a listing
 */
export const ListingsUpdateArchivedStateDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsUpdateArchivedStateDetailsInput,
    outputSchema: ListingsUpdateArchivedStateDetailsOutput,
  }));
