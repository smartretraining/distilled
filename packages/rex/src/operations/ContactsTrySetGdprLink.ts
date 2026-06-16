import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsTrySetGdprLinkInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::trySetGdprLink" }));
export type ContactsTrySetGdprLinkInput =
  typeof ContactsTrySetGdprLinkInput.Type;

// Output Schema
export const ContactsTrySetGdprLinkOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsTrySetGdprLinkOutput =
  typeof ContactsTrySetGdprLinkOutput.Type;

// The operation
export const ContactsTrySetGdprLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ContactsTrySetGdprLinkInput,
    outputSchema: ContactsTrySetGdprLinkOutput,
  }),
);
