import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackReadInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
  fields: Schema.optional(Schema.Array(Schema.Unknown)),
  extra_fields: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Feedback::read" }));
export type FeedbackReadInput = typeof FeedbackReadInput.Type;

// Output Schema
export const FeedbackReadOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Struct({
    system_record_state: Schema.optional(Schema.NullOr(Schema.String)),
    system_ctime: Schema.optional(Schema.NullOr(Schema.Number)),
    system_modtime: Schema.optional(Schema.NullOr(Schema.Number)),
    system_approval_status_time: Schema.optional(Schema.NullOr(Schema.Number)),
    date_of: Schema.optional(Schema.NullOr(Schema.String)),
    date_time_start: Schema.optional(Schema.Unknown),
    date_time_finish: Schema.optional(Schema.Unknown),
    date_finish: Schema.optional(Schema.Unknown),
    amount_of: Schema.optional(Schema.NullOr(Schema.Number)),
    number_of_people: Schema.optional(Schema.NullOr(Schema.Number)),
    price_previous_match: Schema.optional(Schema.Unknown),
    price_previous_advertising: Schema.optional(Schema.Unknown),
    price_new_match: Schema.optional(Schema.Unknown),
    price_new_advertising: Schema.optional(Schema.Unknown),
    has_individual_feedback: Schema.optional(Schema.NullOr(Schema.Boolean)),
    etag: Schema.optional(Schema.NullOr(Schema.String)),
    system_modified_user: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          name: Schema.optional(Schema.NullOr(Schema.String)),
          first_name: Schema.optional(Schema.NullOr(Schema.String)),
          last_name: Schema.optional(Schema.NullOr(Schema.String)),
          email_address: Schema.optional(Schema.NullOr(Schema.String)),
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
          email_address: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    project: Schema.optional(Schema.Unknown),
    project_stage: Schema.optional(Schema.Unknown),
    listing: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
          listing_category_name: Schema.optional(Schema.Unknown),
          listing_agent_1: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                name: Schema.optional(Schema.NullOr(Schema.String)),
                first_name: Schema.optional(Schema.NullOr(Schema.String)),
                last_name: Schema.optional(Schema.NullOr(Schema.String)),
                email_address: Schema.optional(Schema.NullOr(Schema.String)),
                phone_direct: Schema.optional(Schema.Unknown),
                phone_mobile: Schema.optional(Schema.Unknown),
                position: Schema.optional(Schema.Unknown),
                is_account_user: Schema.optional(Schema.NullOr(Schema.String)),
                profile_image: Schema.optional(Schema.Unknown),
              }),
            ),
          ),
          listing_agent_2: Schema.optional(Schema.Unknown),
          system_listing_state: Schema.optional(Schema.NullOr(Schema.String)),
          price_advertise_as: Schema.optional(Schema.NullOr(Schema.String)),
          available_from_date: Schema.optional(Schema.Unknown),
          meta_other_features: Schema.optional(Schema.Unknown),
          state_value_price: Schema.optional(Schema.Unknown),
          state_date: Schema.optional(Schema.Unknown),
          listing_category: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                text: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          listing_subcategory_1: Schema.optional(Schema.Unknown),
          property: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                system_search_key: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_longitude: Schema.optional(Schema.NullOr(Schema.String)),
                adr_latitude: Schema.optional(Schema.NullOr(Schema.String)),
                adr_unit_number: Schema.optional(Schema.NullOr(Schema.String)),
                adr_street_number: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_street_name: Schema.optional(Schema.NullOr(Schema.String)),
                adr_suburb_or_town: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_locality: Schema.optional(Schema.Unknown),
                adr_state_or_region: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_postcode: Schema.optional(Schema.NullOr(Schema.String)),
                adr_country: Schema.optional(Schema.NullOr(Schema.String)),
                adr_estate_name: Schema.optional(Schema.Unknown),
                adr_estate_stage: Schema.optional(Schema.Unknown),
                title_number: Schema.optional(Schema.NullOr(Schema.String)),
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
                adr_building: Schema.optional(Schema.Unknown),
                property_category: Schema.optional(
                  Schema.NullOr(
                    Schema.Struct({
                      id: Schema.optional(Schema.NullOr(Schema.String)),
                      text: Schema.optional(Schema.NullOr(Schema.String)),
                    }),
                  ),
                ),
                property_image: Schema.optional(Schema.Unknown),
                etag: Schema.optional(Schema.NullOr(Schema.String)),
                id: Schema.optional(Schema.NullOr(Schema.Number)),
              }),
            ),
          ),
          listing_primary_image: Schema.optional(Schema.Unknown),
          location: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                text: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          project_stage: Schema.optional(Schema.Unknown),
          system_owner_user: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                name: Schema.optional(Schema.NullOr(Schema.String)),
                first_name: Schema.optional(Schema.NullOr(Schema.String)),
                last_name: Schema.optional(Schema.NullOr(Schema.String)),
                email_address: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          legal_solicitor_contact: Schema.optional(Schema.Unknown),
          legal_solicitor: Schema.optional(Schema.Unknown),
          related: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                contact_reln_listing: Schema.optional(
                  Schema.NullOr(
                    Schema.Array(
                      Schema.NullOr(
                        Schema.Struct({
                          do_not_contact: Schema.optional(Schema.Unknown),
                          id: Schema.optional(Schema.NullOr(Schema.Number)),
                          reln_type: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                id: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                text: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                              }),
                            ),
                          ),
                          contact: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                system_record_state: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                system_ctime: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                system_modtime: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                email_address: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                phone_number: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                fax_number: Schema.optional(Schema.Unknown),
                                is_dnd: Schema.optional(Schema.Unknown),
                                type: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                last_contacted_date: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                name_last: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                name_first: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                address_postal: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                address: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                interest_level: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                marketing_birthday: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                marketing_enquiry_source: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                marketing_gender: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                marketing_postcode: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                name_legal: Schema.optional(Schema.Unknown),
                                name_salutation: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                name_addressee: Schema.optional(Schema.Unknown),
                                system_owner_user: Schema.optional(
                                  Schema.NullOr(
                                    Schema.Struct({
                                      id: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      name: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      first_name: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      last_name: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      email_address: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                    }),
                                  ),
                                ),
                                contact_image: Schema.optional(Schema.Unknown),
                                marketing_enquiry_method: Schema.optional(
                                  Schema.Unknown,
                                ),
                                etag: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                id: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                              }),
                            ),
                          ),
                        }),
                      ),
                    ),
                  ),
                ),
              }),
            ),
          ),
        }),
      ),
    ),
    agent: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          name: Schema.optional(Schema.NullOr(Schema.String)),
          first_name: Schema.optional(Schema.NullOr(Schema.String)),
          last_name: Schema.optional(Schema.NullOr(Schema.String)),
          email_address: Schema.optional(Schema.NullOr(Schema.String)),
          phone_direct: Schema.optional(Schema.Unknown),
          phone_mobile: Schema.optional(Schema.Unknown),
          position: Schema.optional(Schema.Unknown),
          is_account_user: Schema.optional(Schema.NullOr(Schema.String)),
          profile_image: Schema.optional(Schema.Unknown),
        }),
      ),
    ),
    system_approval_status_user: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          name: Schema.optional(Schema.NullOr(Schema.String)),
          first_name: Schema.optional(Schema.NullOr(Schema.String)),
          last_name: Schema.optional(Schema.NullOr(Schema.String)),
          email_address: Schema.optional(Schema.NullOr(Schema.String)),
          phone_direct: Schema.optional(Schema.Unknown),
          phone_mobile: Schema.optional(Schema.Unknown),
          position: Schema.optional(Schema.Unknown),
          is_account_user: Schema.optional(Schema.NullOr(Schema.String)),
          profile_image: Schema.optional(Schema.Unknown),
        }),
      ),
    ),
    feedback_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    enquiry_source: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    system_approval_status: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    interest_level: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    security_user_rights: Schema.optional(
      Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
    ),
    note: Schema.optional(Schema.NullOr(Schema.String)),
    related: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          feedback_contacts: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    contact: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          system_record_state: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          system_ctime: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          system_modtime: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          name: Schema.optional(Schema.NullOr(Schema.String)),
                          email_address: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          phone_number: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          fax_number: Schema.optional(Schema.Unknown),
                          is_dnd: Schema.optional(Schema.Unknown),
                          type: Schema.optional(Schema.NullOr(Schema.String)),
                          last_contacted_date: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          name_last: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          name_first: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          address_postal: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          address: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          interest_level: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          marketing_birthday: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          marketing_enquiry_method: Schema.optional(
                            Schema.Unknown,
                          ),
                          marketing_enquiry_source: Schema.optional(
                            Schema.Unknown,
                          ),
                          marketing_gender: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          marketing_postcode: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          name_legal: Schema.optional(Schema.Unknown),
                          name_salutation: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          name_addressee: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          system_owner_user: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                id: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                first_name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                last_name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                email_address: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                              }),
                            ),
                          ),
                          contact_image: Schema.optional(Schema.Unknown),
                          etag: Schema.optional(Schema.NullOr(Schema.String)),
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                  }),
                ),
              ),
            ),
          ),
          feedback_individual: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
        }),
      ),
    ),
    id: Schema.optional(Schema.NullOr(Schema.Number)),
  }),
);
export type FeedbackReadOutput = typeof FeedbackReadOutput.Type;

// The operation
/**
 * Read a record by id
 */
export const FeedbackRead = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: FeedbackReadInput,
  outputSchema: FeedbackReadOutput,
}));
