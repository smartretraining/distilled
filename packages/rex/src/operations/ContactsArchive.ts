import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsArchiveInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::archive" }));
export type ContactsArchiveInput = typeof ContactsArchiveInput.Type;

// Output Schema
export const ContactsArchiveOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Number,
);
export type ContactsArchiveOutput = typeof ContactsArchiveOutput.Type;

// The operation
/**
 * Archives a record - archived records are omitted from search results but can be restored at any time.
 */
export const ContactsArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ContactsArchiveInput,
  outputSchema: ContactsArchiveOutput,
}));
