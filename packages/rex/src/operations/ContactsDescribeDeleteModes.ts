import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsDescribeDeleteModesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::describeDeleteModes" }),
  );
export type ContactsDescribeDeleteModesInput =
  typeof ContactsDescribeDeleteModesInput.Type;

// Output Schema
export const ContactsDescribeDeleteModesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Array(Schema.NullOr(Schema.String));
export type ContactsDescribeDeleteModesOutput =
  typeof ContactsDescribeDeleteModesOutput.Type;

// The operation
/**
 * Describes available delete modes
 */
export const ContactsDescribeDeleteModes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsDescribeDeleteModesInput,
    outputSchema: ContactsDescribeDeleteModesOutput,
  }),
);
