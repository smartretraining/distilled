import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsDownloadEpcGraphInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    type: Schema.String,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::downloadEpcGraph" }),
  );
export type ListingsDownloadEpcGraphInput =
  typeof ListingsDownloadEpcGraphInput.Type;

// Output Schema
export const ListingsDownloadEpcGraphOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsDownloadEpcGraphOutput =
  typeof ListingsDownloadEpcGraphOutput.Type;

// The operation
/**
 * Download a listing EPC graph.
 */
export const ListingsDownloadEpcGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ListingsDownloadEpcGraphInput,
    outputSchema: ListingsDownloadEpcGraphOutput,
  }),
);
