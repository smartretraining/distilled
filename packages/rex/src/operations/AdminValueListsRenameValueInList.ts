import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsRenameValueInListInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    value_id: Schema.Unknown,
    display_text: Schema.Unknown,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminValueLists::renameValueInList",
    }),
  );
export type AdminValueListsRenameValueInListInput =
  typeof AdminValueListsRenameValueInListInput.Type;

// Output Schema
export const AdminValueListsRenameValueInListOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsRenameValueInListOutput =
  typeof AdminValueListsRenameValueInListOutput.Type;

// The operation
/**
 * Rename a user value in a list
 */
export const AdminValueListsRenameValueInList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsRenameValueInListInput,
    outputSchema: AdminValueListsRenameValueInListOutput,
  }));
