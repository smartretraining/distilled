import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsGetValueListNamesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    return_objects: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminValueLists::getValueListNames",
    }),
  );
export type AdminValueListsGetValueListNamesInput =
  typeof AdminValueListsGetValueListNamesInput.Type;

// Output Schema
export const AdminValueListsGetValueListNamesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsGetValueListNamesOutput =
  typeof AdminValueListsGetValueListNamesOutput.Type;

// The operation
/**
 * Retrieves an array of value list names from the system for use with this end point
 */
export const AdminValueListsGetValueListNames =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsGetValueListNamesInput,
    outputSchema: AdminValueListsGetValueListNamesOutput,
  }));
