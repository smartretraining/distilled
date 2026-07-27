import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsDeleteValueInListInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    value_id: Schema.Number,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminValueLists::deleteValueInList",
    }),
  );
export type AdminValueListsDeleteValueInListInput =
  typeof AdminValueListsDeleteValueInListInput.Type;

// Output Schema
export const AdminValueListsDeleteValueInListOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsDeleteValueInListOutput =
  typeof AdminValueListsDeleteValueInListOutput.Type;

// The operation
/**
 * Delete a value in list
 */
export const AdminValueListsDeleteValueInList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsDeleteValueInListInput,
    outputSchema: AdminValueListsDeleteValueInListOutput,
  }));
