import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsUpdateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
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
    id: Schema.optional(Schema.Number),
    related: Schema.optional(
      Schema.Struct({
        contact_emails: Schema.optional(
          Schema.NullOr(
            Schema.Array(
              Schema.Struct({
                contact_name_id: Schema.optional(Schema.NullOr(Schema.Number)),
                email_desc: Schema.optional(Schema.String),
                email_address: Schema.optional(Schema.String),
                email_primary: Schema.optional(Schema.NullOr(Schema.Boolean)),
                email_secondary: Schema.optional(Schema.NullOr(Schema.Boolean)),
                id: Schema.optional(Schema.Number),
              }),
            ),
          ),
        ),
        contact_phones: Schema.optional(
          Schema.NullOr(
            Schema.Array(
              Schema.Struct({
                contact_name_id: Schema.optional(Schema.NullOr(Schema.Number)),
                phone_type: Schema.optional(Schema.String),
                phone_number: Schema.optional(Schema.String),
                phone_primary: Schema.optional(Schema.NullOr(Schema.Boolean)),
                phone_primary_sms: Schema.optional(
                  Schema.NullOr(Schema.Boolean),
                ),
                id: Schema.optional(Schema.Number),
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
              id: Schema.optional(Schema.Number),
            }),
          ),
        ),
      }),
    ),
  }),
  fields: Schema.optional(Schema.Unknown),
  extra_fields: Schema.optional(Schema.Unknown),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Contacts::update" }));
export type ContactsUpdateInput = typeof ContactsUpdateInput.Type;

// Output Schema
export const ContactsUpdateOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Struct({
    system_record_state: Schema.optional(Schema.NullOr(Schema.String)),
    system_ctime: Schema.optional(Schema.NullOr(Schema.Number)),
    system_modtime: Schema.optional(Schema.NullOr(Schema.Number)),
    system_search_key: Schema.optional(Schema.NullOr(Schema.String)),
    address: Schema.optional(Schema.NullOr(Schema.String)),
    address_postal: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_postcode: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_enquiry_method: Schema.optional(Schema.Unknown),
    marketing_enquiry_source: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_gender: Schema.optional(Schema.NullOr(Schema.String)),
    marketing_birthday: Schema.optional(Schema.NullOr(Schema.String)),
    company_name: Schema.optional(Schema.Unknown),
    company_abn: Schema.optional(Schema.Unknown),
    company_size: Schema.optional(Schema.Unknown),
    website_url: Schema.optional(Schema.Unknown),
    is_dnd: Schema.optional(Schema.NullOr(Schema.Boolean)),
    type: Schema.optional(Schema.NullOr(Schema.String)),
    interest_level: Schema.optional(Schema.NullOr(Schema.String)),
    last_contacted_date: Schema.optional(Schema.NullOr(Schema.String)),
    name_legal: Schema.optional(Schema.Unknown),
    name_salutation: Schema.optional(Schema.NullOr(Schema.String)),
    name_addressee: Schema.optional(Schema.Unknown),
    last_contacted_at: Schema.optional(Schema.Unknown),
    contact_image: Schema.optional(Schema.Unknown),
    id: Schema.optional(Schema.NullOr(Schema.Number)),
    etag: Schema.optional(Schema.NullOr(Schema.String)),
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
    related: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          contact_emails: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    contact_name_id: Schema.optional(
                      Schema.NullOr(Schema.Number),
                    ),
                    email_desc: Schema.optional(Schema.NullOr(Schema.String)),
                    email_address: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    email_primary: Schema.optional(
                      Schema.NullOr(Schema.Boolean),
                    ),
                    email_secondary: Schema.optional(Schema.Unknown),
                    is_invalid: Schema.optional(Schema.Unknown),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
            ),
          ),
          contact_names: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    system_search_key: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    name_title: Schema.optional(Schema.Unknown),
                    name_first: Schema.optional(Schema.NullOr(Schema.String)),
                    name_middle: Schema.optional(Schema.Unknown),
                    name_last: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
            ),
          ),
          contact_phones: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    contact_name_id: Schema.optional(
                      Schema.NullOr(Schema.Number),
                    ),
                    phone_type: Schema.optional(Schema.NullOr(Schema.String)),
                    phone_number: Schema.optional(Schema.NullOr(Schema.String)),
                    phone_primary: Schema.optional(
                      Schema.NullOr(Schema.Boolean),
                    ),
                    phone_primary_sms: Schema.optional(
                      Schema.NullOr(Schema.Boolean),
                    ),
                    is_invalid: Schema.optional(Schema.Unknown),
                    system_e164_phone_number: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
            ),
          ),
          contact_tags: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    tag: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
            ),
          ),
          contact_documents: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          contact_mailing_lists: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    mailing_list_name: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    subscription_status: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    unsubscribe_reason: Schema.optional(Schema.Unknown),
                    subscribe_timestamp: Schema.optional(
                      Schema.NullOr(Schema.Number),
                    ),
                    unsubscribe_timestamp: Schema.optional(Schema.Unknown),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
            ),
          ),
          contact_relationships: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    custom_reln_desc: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    relationship_type: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                    related_contact: Schema.optional(
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
                            Schema.Unknown,
                          ),
                          marketing_gender: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          marketing_postcode: Schema.optional(
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
                          marketing_enquiry_method: Schema.optional(
                            Schema.Unknown,
                          ),
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
          contact_reln_property: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    reln_type: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                    property: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          system_search_key: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_latitude: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_longitude: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_unit_number: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_street_number: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_street_name: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_state_or_region: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_locality: Schema.optional(Schema.Unknown),
                          adr_suburb_or_town: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_postcode: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_country: Schema.optional(
                            Schema.NullOr(Schema.String),
                          ),
                          adr_estate_name: Schema.optional(Schema.Unknown),
                          adr_estate_stage: Schema.optional(Schema.Unknown),
                          title_number: Schema.optional(
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
                          adr_building: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_street_number: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_street_name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_suburb_or_town: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_state_or_region: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_locality: Schema.optional(Schema.Unknown),
                                adr_postcode: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_country: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                building_image: Schema.optional(Schema.Unknown),
                                id: Schema.optional(
                                  Schema.NullOr(Schema.Number),
                                ),
                              }),
                            ),
                          ),
                          property_category: Schema.optional(
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
                          property_image: Schema.optional(Schema.Unknown),
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
          contact_reln_listing: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    reln_type: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                    listing: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.Number)),
                          listing_agent_1: Schema.optional(
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
                                phone_direct: Schema.optional(Schema.Unknown),
                                phone_mobile: Schema.optional(Schema.Unknown),
                                position: Schema.optional(Schema.Unknown),
                                is_account_user: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                profile_image: Schema.optional(Schema.Unknown),
                              }),
                            ),
                          ),
                          listing_agent_2: Schema.optional(Schema.Unknown),
                          listing_category: Schema.optional(
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
                          listing_primary_image: Schema.optional(
                            Schema.Unknown,
                          ),
                          location: Schema.optional(
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
                          project_stage: Schema.optional(Schema.Unknown),
                          property: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                system_search_key: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_unit_number: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_street_number: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_street_name: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_state_or_region: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_suburb_or_town: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_postcode: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                adr_country: Schema.optional(
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
                  }),
                ),
              ),
            ),
          ),
        }),
      ),
    ),
    match_summary: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          count_pending: Schema.optional(Schema.Unknown),
          match_profile_ids_with_active_campaigns: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          match_profile_ids_all: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          last_update: Schema.optional(Schema.Unknown),
        }),
      ),
    ),
    security_user_rights: Schema.optional(
      Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
    ),
  }),
);
export type ContactsUpdateOutput = typeof ContactsUpdateOutput.Type;

// The operation
/**
 * Update the record. To remove sub records include the _destroy flag
 */
export const ContactsUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ContactsUpdateInput,
  outputSchema: ContactsUpdateOutput,
}));
