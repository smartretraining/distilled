import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsGetListValuesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    list_name: Schema.String,
    include_system_values: Schema.optional(Schema.Boolean),
    include_omitted_values: Schema.optional(Schema.Boolean),
    retrieve_meta: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/AdminValueLists::getListValues" }),
  );
export type AdminValueListsGetListValuesInput =
  typeof AdminValueListsGetListValuesInput.Type;

// Output Schema
export const AdminValueListsGetListValuesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminValueListsGetListValuesOutput =
  typeof AdminValueListsGetListValuesOutput.Type;

// The operation
/**
 * Retrieves an array of list values from the system.
 */
export const AdminValueListsGetListValues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminValueListsGetListValuesInput,
    outputSchema: AdminValueListsGetListValuesOutput,
  }));
