import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsRecoverFromArchiveInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::recoverFromArchive" }),
  );
export type ContactsRecoverFromArchiveInput =
  typeof ContactsRecoverFromArchiveInput.Type;

// Output Schema
export const ContactsRecoverFromArchiveOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type ContactsRecoverFromArchiveOutput =
  typeof ContactsRecoverFromArchiveOutput.Type;

// The operation
/**
 * Recovers a record from the archive
 */
export const ContactsRecoverFromArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsRecoverFromArchiveInput,
    outputSchema: ContactsRecoverFromArchiveOutput,
  }),
);
