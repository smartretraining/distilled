import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsShowSystemValueInListInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    value_id: Schema.String,
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminValueLists::showSystemValueInList",
    }),
  );
export type AdminValueListsShowSystemValueInListInput =
  typeof AdminValueListsShowSystemValueInListInput.Type;

// Output Schema
export const AdminValueListsShowSystemValueInListOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsShowSystemValueInListOutput =
  typeof AdminValueListsShowSystemValueInListOutput.Type;

// The operation
/**
 * Show system value on list
 */
export const AdminValueListsShowSystemValueInList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsShowSystemValueInListInput,
    outputSchema: AdminValueListsShowSystemValueInListOutput,
  }));
