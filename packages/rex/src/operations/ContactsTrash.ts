import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsTrashInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::trash" }));
export type ContactsTrashInput = typeof ContactsTrashInput.Type;

// Output Schema
export const ContactsTrashOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Number,
);
export type ContactsTrashOutput = typeof ContactsTrashOutput.Type;

// The operation
/**
 * Trash a record - trashed records are like archived records but may be recovered for 30 days after deletion (after which they are purged from the system).
 */
export const ContactsTrash = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ContactsTrashInput,
  outputSchema: ContactsTrashOutput,
}));
