import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesDescribeDeleteModesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Properties::describeDeleteModes" }),
  );
export type PropertiesDescribeDeleteModesInput =
  typeof PropertiesDescribeDeleteModesInput.Type;

// Output Schema
export const PropertiesDescribeDeleteModesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Array(Schema.NullOr(Schema.String));
export type PropertiesDescribeDeleteModesOutput =
  typeof PropertiesDescribeDeleteModesOutput.Type;

// The operation
/**
 * Describes available delete modes
 */
export const PropertiesDescribeDeleteModes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: PropertiesDescribeDeleteModesInput,
    outputSchema: PropertiesDescribeDeleteModesOutput,
  }));
