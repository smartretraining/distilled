import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsGetMatchSummaryInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    contact_id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::getMatchSummary" }),
  );
export type ContactsGetMatchSummaryInput =
  typeof ContactsGetMatchSummaryInput.Type;

// Output Schema
export const ContactsGetMatchSummaryOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsGetMatchSummaryOutput =
  typeof ContactsGetMatchSummaryOutput.Type;

// The operation
/**
 * Get match summary
 */
export const ContactsGetMatchSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsGetMatchSummaryInput,
    outputSchema: ContactsGetMatchSummaryOutput,
  }),
);
