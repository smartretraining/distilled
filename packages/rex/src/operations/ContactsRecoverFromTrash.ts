import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsRecoverFromTrashInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::recoverFromTrash" }),
  );
export type ContactsRecoverFromTrashInput =
  typeof ContactsRecoverFromTrashInput.Type;

// Output Schema
export const ContactsRecoverFromTrashOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type ContactsRecoverFromTrashOutput =
  typeof ContactsRecoverFromTrashOutput.Type;

// The operation
/**
 * Recover a record from the trash
 *
 * Recovers a record from the trash
 */
export const ContactsRecoverFromTrash = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsRecoverFromTrashInput,
    outputSchema: ContactsRecoverFromTrashOutput,
  }),
);
