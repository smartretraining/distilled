import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsDescribeDeleteModesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::describeDeleteModes" }),
  );
export type ListingsDescribeDeleteModesInput =
  typeof ListingsDescribeDeleteModesInput.Type;

// Output Schema
export const ListingsDescribeDeleteModesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Array(Schema.NullOr(Schema.String));
export type ListingsDescribeDeleteModesOutput =
  typeof ListingsDescribeDeleteModesOutput.Type;

// The operation
/**
 * Describes available delete modes
 */
export const ListingsDescribeDeleteModes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ListingsDescribeDeleteModesInput,
    outputSchema: ListingsDescribeDeleteModesOutput,
  }),
);
