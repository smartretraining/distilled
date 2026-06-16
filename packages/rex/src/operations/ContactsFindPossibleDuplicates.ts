import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsFindPossibleDuplicatesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    email: Schema.optional(Schema.String),
    phone: Schema.optional(Schema.String),
    name_first: Schema.optional(Schema.String),
    name_last: Schema.optional(Schema.String),
    company_name: Schema.optional(Schema.String),
    contact_type: Schema.optional(Schema.String),
    min_user_relationship_to_contact: Schema.optional(Schema.String),
    match_behaviour: Schema.optional(Schema.String),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Contacts::findPossibleDuplicates",
    }),
  );
export type ContactsFindPossibleDuplicatesInput =
  typeof ContactsFindPossibleDuplicatesInput.Type;

// Output Schema
export const ContactsFindPossibleDuplicatesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsFindPossibleDuplicatesOutput =
  typeof ContactsFindPossibleDuplicatesOutput.Type;

// The operation
/**
 * Retrieves possible duplicate records based on parameters passed in
 */
export const ContactsFindPossibleDuplicates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ContactsFindPossibleDuplicatesInput,
    outputSchema: ContactsFindPossibleDuplicatesOutput,
  }));
