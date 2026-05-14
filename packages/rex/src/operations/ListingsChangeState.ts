import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsChangeStateInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    state: Schema.String,
    details: Schema.Array(Schema.Unknown),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::changeState" }));
export type ListingsChangeStateInput = typeof ListingsChangeStateInput.Type;

// Output Schema
export const ListingsChangeStateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsChangeStateOutput = typeof ListingsChangeStateOutput.Type;

// The operation
/**
 * Update the state of a listing
 */
export const ListingsChangeState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsChangeStateInput,
  outputSchema: ListingsChangeStateOutput,
}));
