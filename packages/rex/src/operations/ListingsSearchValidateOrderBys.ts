import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsSearchValidateOrderBysInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    order_bys: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::searchValidateOrderBys",
    }),
  );
export type ListingsSearchValidateOrderBysInput =
  typeof ListingsSearchValidateOrderBysInput.Type;

// Output Schema
export const ListingsSearchValidateOrderBysOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsSearchValidateOrderBysOutput =
  typeof ListingsSearchValidateOrderBysOutput.Type;

// The operation
/**
 * Validates orderby based on allowable (orderby) fields. If orderby fields provided, uses this, otherwise limited to non restricted search fields.
 */
export const ListingsSearchValidateOrderBys =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsSearchValidateOrderBysInput,
    outputSchema: ListingsSearchValidateOrderBysOutput,
  }));
