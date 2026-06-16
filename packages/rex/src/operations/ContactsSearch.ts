import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsSearchInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  criteria: Schema.optional(Schema.Unknown),
  order_by: Schema.optional(Schema.String),
  offset: Schema.optional(Schema.Number),
  limit: Schema.optional(Schema.Number),
  create_viewstate: Schema.optional(Schema.Boolean),
  result_format: Schema.optional(Schema.String),
  extra_options: Schema.optional(Schema.Array(Schema.Unknown)),
  search_state: Schema.optional(Schema.Unknown),
  ids_only: Schema.optional(Schema.Boolean),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::search" }));
export type ContactsSearchInput = typeof ContactsSearchInput.Type;

// Output Schema
export const ContactsSearchOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Struct({
    rows: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              system_record_state: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              system_ctime: Schema.optional(Schema.NullOr(Schema.String)),
              system_modtime: Schema.optional(Schema.NullOr(Schema.String)),
              name: Schema.optional(Schema.NullOr(Schema.String)),
              email_address: Schema.optional(Schema.NullOr(Schema.String)),
              phone_number: Schema.optional(Schema.NullOr(Schema.String)),
              fax_number: Schema.optional(Schema.Unknown),
              is_dnd: Schema.optional(Schema.NullOr(Schema.String)),
              type: Schema.optional(Schema.NullOr(Schema.String)),
              last_contacted_date: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              name_last: Schema.optional(Schema.NullOr(Schema.String)),
              address_postal: Schema.optional(Schema.NullOr(Schema.String)),
              address: Schema.optional(Schema.NullOr(Schema.String)),
              interest_level: Schema.optional(Schema.NullOr(Schema.String)),
              marketing_birthday: Schema.optional(Schema.NullOr(Schema.String)),
              marketing_enquiry_method: Schema.optional(Schema.Unknown),
              marketing_enquiry_source: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              marketing_gender: Schema.optional(Schema.NullOr(Schema.String)),
              marketing_postcode: Schema.optional(Schema.NullOr(Schema.String)),
              contact_image: Schema.optional(Schema.Unknown),
              system_owner_user: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    name: Schema.optional(Schema.NullOr(Schema.String)),
                    first_name: Schema.optional(Schema.NullOr(Schema.String)),
                    last_name: Schema.optional(Schema.NullOr(Schema.String)),
                    email_address: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                  }),
                ),
              ),
              system_modified_user: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    name: Schema.optional(Schema.NullOr(Schema.String)),
                    first_name: Schema.optional(Schema.NullOr(Schema.String)),
                    last_name: Schema.optional(Schema.NullOr(Schema.String)),
                    email_address: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                  }),
                ),
              ),
              system_created_user: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    name: Schema.optional(Schema.NullOr(Schema.String)),
                    first_name: Schema.optional(Schema.NullOr(Schema.String)),
                    last_name: Schema.optional(Schema.NullOr(Schema.String)),
                    email_address: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                  }),
                ),
              ),
              security_user_rights: Schema.optional(
                Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
              ),
              etag: Schema.optional(Schema.NullOr(Schema.String)),
              id: Schema.optional(Schema.NullOr(Schema.String)),
            }),
          ),
        ),
      ),
    ),
    total: Schema.optional(Schema.NullOr(Schema.Number)),
    viewstate_id: Schema.optional(Schema.Unknown),
    criteria: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              name: Schema.optional(Schema.NullOr(Schema.String)),
              value: Schema.optional(Schema.NullOr(Schema.String)),
            }),
          ),
        ),
      ),
    ),
    order_by: Schema.optional(Schema.NullOr(Schema.Array(Schema.Unknown))),
  }),
);
export type ContactsSearchOutput = typeof ContactsSearchOutput.Type;

// The operation
/**
 * Perform a search
 */
export const ContactsSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ContactsSearchInput,
  outputSchema: ContactsSearchOutput,
}));
