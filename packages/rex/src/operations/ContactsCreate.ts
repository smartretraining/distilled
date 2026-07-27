import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsCreateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  data: Schema.Struct({
    address: Schema.optional(Schema.NullOr(Schema.String)),
    address_postal: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_postcode: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_enquiry_method: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    marketing_enquiry_source: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    marketing_gender: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_birthday: Schema.optional(Schema.NullOr(Schema.String)),
    company_name: Schema.optional(Schema.String),
    company_abn: Schema.optional(Schema.NullOr(Schema.String)),
    company_size_id: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.NullOr(Schema.String)),
      }),
    ),
    website_url: Schema.optional(Schema.NullOr(Schema.String)),
    is_dnd: Schema.optional(Schema.NullOr(Schema.Boolean)),
    type: Schema.optional(Schema.String),
    interest_level: Schema.optional(Schema.NullOr(Schema.String)),
    last_contacted_date: Schema.optional(Schema.NullOr(Schema.String)),
    contact_image_uri: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          uri: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    name_legal: Schema.optional(Schema.NullOr(Schema.String)),
    name_salutation: Schema.optional(Schema.NullOr(Schema.String)),
    name_addressee: Schema.optional(Schema.NullOr(Schema.String)),
    related: Schema.optional(
      Schema.Struct({
        contact_emails: Schema.optional(
          Schema.NullOr(
            Schema.Array(
              Schema.Struct({
                email_desc: Schema.optional(Schema.String),
                email_address: Schema.optional(Schema.String),
                email_primary: Schema.optional(Schema.NullOr(Schema.Boolean)),
                email_secondary: Schema.optional(Schema.NullOr(Schema.Boolean)),
                contact_name_id: Schema.optional(Schema.NullOr(Schema.Number)),
              }),
            ),
          ),
        ),
        contact_phones: Schema.optional(
          Schema.NullOr(
            Schema.Array(
              Schema.Struct({
                phone_type: Schema.optional(Schema.String),
                phone_number: Schema.optional(Schema.String),
                phone_primary: Schema.optional(Schema.NullOr(Schema.Boolean)),
                phone_primary_sms: Schema.optional(
                  Schema.NullOr(Schema.Boolean),
                ),
                contact_name_id: Schema.optional(Schema.NullOr(Schema.Number)),
              }),
            ),
          ),
        ),
        contact_names: Schema.optional(
          Schema.Array(
            Schema.Struct({
              name_title: Schema.optional(Schema.NullOr(Schema.String)),
              name_first: Schema.optional(Schema.String),
              name_middle: Schema.optional(Schema.NullOr(Schema.String)),
              name_last: Schema.optional(Schema.String),
            }),
          ),
        ),
      }),
    ),
  }),
  return_id: Schema.optional(Schema.Boolean),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::create" }));
export type ContactsCreateInput = typeof ContactsCreateInput.Type;

// Output Schema
export const ContactsCreateOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsCreateOutput = typeof ContactsCreateOutput.Type;

// The operation
/**
 * Create a record and return a reference to the id
 */
export const ContactsCreate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ContactsCreateInput,
  outputSchema: ContactsCreateOutput,
}));
