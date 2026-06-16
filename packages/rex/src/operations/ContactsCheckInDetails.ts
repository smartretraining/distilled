import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsCheckInDetailsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    criteria: Schema.Unknown,
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::checkInDetails" }));
export type ContactsCheckInDetailsInput =
  typeof ContactsCheckInDetailsInput.Type;

// Output Schema
export const ContactsCheckInDetailsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsCheckInDetailsOutput =
  typeof ContactsCheckInDetailsOutput.Type;

// The operation
export const ContactsCheckInDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsCheckInDetailsInput,
    outputSchema: ContactsCheckInDetailsOutput,
  }),
);
