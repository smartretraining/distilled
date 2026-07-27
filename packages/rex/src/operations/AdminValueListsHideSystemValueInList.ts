import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsHideSystemValueInListInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    value_id: Schema.String,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminValueLists::hideSystemValueInList",
    }),
  );
export type AdminValueListsHideSystemValueInListInput =
  typeof AdminValueListsHideSystemValueInListInput.Type;

// Output Schema
export const AdminValueListsHideSystemValueInListOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsHideSystemValueInListOutput =
  typeof AdminValueListsHideSystemValueInListOutput.Type;

// The operation
/**
 * Hides a system value from a value list
 */
export const AdminValueListsHideSystemValueInList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsHideSystemValueInListInput,
    outputSchema: AdminValueListsHideSystemValueInListOutput,
  }));
