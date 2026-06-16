import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsGetComplianceStatusesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    contact_id: Schema.Unknown,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::getComplianceStatuses" }),
  );
export type ContactsGetComplianceStatusesInput =
  typeof ContactsGetComplianceStatusesInput.Type;

// Output Schema
export const ContactsGetComplianceStatusesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsGetComplianceStatusesOutput =
  typeof ContactsGetComplianceStatusesOutput.Type;

// The operation
export const ContactsGetComplianceStatuses =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ContactsGetComplianceStatusesInput,
    outputSchema: ContactsGetComplianceStatusesOutput,
  }));
