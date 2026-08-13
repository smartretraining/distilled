import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsCombineValuesInListInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    value_source_id: Schema.String,
    value_target_id: Schema.String,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminValueLists::combineValuesInList",
    }),
  );
export type AdminValueListsCombineValuesInListInput =
  typeof AdminValueListsCombineValuesInListInput.Type;

// Output Schema
export const AdminValueListsCombineValuesInListOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsCombineValuesInListOutput =
  typeof AdminValueListsCombineValuesInListOutput.Type;

// The operation
/**
 * Merges a non system values into a single value (system or otherwise)
 */
export const AdminValueListsCombineValuesInList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsCombineValuesInListInput,
    outputSchema: AdminValueListsCombineValuesInListOutput,
  }));
