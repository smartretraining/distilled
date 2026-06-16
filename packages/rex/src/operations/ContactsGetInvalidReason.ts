import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsGetInvalidReasonInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    data_type: Schema.String,
    string: Schema.String,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::getInvalidReason" }),
  );
export type ContactsGetInvalidReasonInput =
  typeof ContactsGetInvalidReasonInput.Type;

// Output Schema
export const ContactsGetInvalidReasonOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsGetInvalidReasonOutput =
  typeof ContactsGetInvalidReasonOutput.Type;

// The operation
/**
 * Use this function to retrieve the invalid reason for a phone number or email address
 */
export const ContactsGetInvalidReason = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsGetInvalidReasonInput,
    outputSchema: ContactsGetInvalidReasonOutput,
  }),
);
