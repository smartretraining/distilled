import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsAddValueToListInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    display_text: Schema.String,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/AdminValueLists::addValueToList" }),
  );
export type AdminValueListsAddValueToListInput =
  typeof AdminValueListsAddValueToListInput.Type;

// Output Schema
export const AdminValueListsAddValueToListOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsAddValueToListOutput =
  typeof AdminValueListsAddValueToListOutput.Type;

// The operation
/**
 * Adds a value to a list
 */
export const AdminValueListsAddValueToList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsAddValueToListInput,
    outputSchema: AdminValueListsAddValueToListOutput,
  }));
