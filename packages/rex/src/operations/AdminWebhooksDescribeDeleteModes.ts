import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksDescribeDeleteModesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminWebhooks::describeDeleteModes",
    }),
  );
export type AdminWebhooksDescribeDeleteModesInput =
  typeof AdminWebhooksDescribeDeleteModesInput.Type;

// Output Schema
export const AdminWebhooksDescribeDeleteModesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Array(Schema.NullOr(Schema.String));
export type AdminWebhooksDescribeDeleteModesOutput =
  typeof AdminWebhooksDescribeDeleteModesOutput.Type;

// The operation
/**
 * Describes available delete modes
 */
export const AdminWebhooksDescribeDeleteModes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminWebhooksDescribeDeleteModesInput,
    outputSchema: AdminWebhooksDescribeDeleteModesOutput,
  }));
