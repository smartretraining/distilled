import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsSearchInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  criteria: Schema.optional(Schema.Unknown),
  order_by: Schema.optional(Schema.String),
  offset: Schema.optional(Schema.Number),
  limit: Schema.optional(Schema.Number),
  create_viewstate: Schema.optional(Schema.Boolean),
  result_format: Schema.optional(Schema.String),
  extra_options: Schema.optional(Schema.Array(Schema.Unknown)),
  search_state: Schema.optional(Schema.Unknown),
  ids_only: Schema.optional(Schema.Boolean),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::search" }));
export type ListingsSearchInput = typeof ListingsSearchInput.Type;

// Output Schema
export const ListingsSearchOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Struct({
    rows: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              system_listing_state: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              system_ctime: Schema.optional(Schema.NullOr(Schema.Number)),
              system_modtime: Schema.optional(Schema.NullOr(Schema.Number)),
              system_publication_time: Schema.optional(
                Schema.NullOr(Schema.Number),
              ),
              system_publication_user_id: Schema.optional(
                Schema.NullOr(Schema.Number),
              ),
              system_publication_status: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              system_overpayment_balance: Schema.optional(Schema.Unknown),
              system_has_preupload_errors: Schema.optional(Schema.Unknown),
              authority_date_start: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              authority_duration_days: Schema.optional(
                Schema.NullOr(Schema.Number),
              ),
              authority_date_expires: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              price_advertise_as: Schema.optional(Schema.NullOr(Schema.String)),
              price_est_rent_pw: Schema.optional(Schema.Unknown),
              price_rent: Schema.optional(Schema.Unknown),
              price_match: Schema.optional(Schema.NullOr(Schema.Number)),
              price_match_sale: Schema.optional(Schema.NullOr(Schema.Number)),
              price_match_rent_pa_inc_tax: Schema.optional(Schema.Unknown),
              price_bond: Schema.optional(Schema.Unknown),
              price_rent_per_m2: Schema.optional(Schema.Unknown),
              available_from_date: Schema.optional(Schema.Unknown),
              inspection_alarm_code: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              inspection_notes: Schema.optional(Schema.NullOr(Schema.String)),
              tenancy_type: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    text: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              lead_auto_response_template: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    _template_medium: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    _template_name: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    _template_email_subject: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    _template_module: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
              outgoings_annual: Schema.optional(Schema.Unknown),
              outgoings_rent_is_plus: Schema.optional(Schema.Unknown),
              meta_highlight_1: Schema.optional(Schema.Unknown),
              meta_highlight_2: Schema.optional(Schema.Unknown),
              meta_highlight_3: Schema.optional(Schema.Unknown),
              meta_other_features: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              feedback_offer_level: Schema.optional(
                Schema.NullOr(Schema.Number),
              ),
              feedback_price_rank: Schema.optional(
                Schema.NullOr(Schema.Number),
              ),
              feedback_notes: Schema.optional(Schema.NullOr(Schema.String)),
              legal_prop_lot: Schema.optional(Schema.NullOr(Schema.String)),
              legal_prop_subdivision: Schema.optional(Schema.Unknown),
              legal_prop_address: Schema.optional(Schema.NullOr(Schema.String)),
              legal_prop_description: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              legal_prop_titleref: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              legal_vendor_name: Schema.optional(Schema.NullOr(Schema.String)),
              legal_vendor_residence: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              state_value_price: Schema.optional(Schema.Unknown),
              state_value_price_rent_period: Schema.optional(Schema.Unknown),
              state_value_deposit: Schema.optional(Schema.Unknown),
              state_date: Schema.optional(Schema.Unknown),
              state_reason_id: Schema.optional(Schema.Unknown),
              state_reason_note: Schema.optional(Schema.Unknown),
              state_lost_agency_id: Schema.optional(Schema.Unknown),
              state_change_timestamp: Schema.optional(Schema.Unknown),
              inbound_unique_id: Schema.optional(Schema.Unknown),
              inbound_last_update: Schema.optional(Schema.Unknown),
              publish_to_portals: Schema.optional(
                Schema.NullOr(Schema.Boolean),
              ),
              publish_to_automatch: Schema.optional(
                Schema.NullOr(Schema.Boolean),
              ),
              publish_to_external: Schema.optional(
                Schema.NullOr(Schema.Boolean),
              ),
              publish_to_general: Schema.optional(
                Schema.NullOr(Schema.Boolean),
              ),
              status_is_not_for_sale: Schema.optional(Schema.Unknown),
              baseline_price: Schema.optional(Schema.Unknown),
              parent_listing_id: Schema.optional(Schema.Unknown),
              new_home: Schema.optional(Schema.Unknown),
              let_agreed: Schema.optional(Schema.Unknown),
              comm_amount_fixed: Schema.optional(Schema.Unknown),
              comm_amount_percentage: Schema.optional(Schema.Unknown),
              comm_is_inc_tax: Schema.optional(Schema.Unknown),
              comm_est_based_on_service: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              comm_est_based_on_object_id: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              comm_est_based_on_amount: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              comm_est_amount_net_of_tax: Schema.optional(Schema.Unknown),
              comm_est_amount_inc_tax: Schema.optional(Schema.Unknown),
              permit_number: Schema.optional(Schema.Unknown),
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
              landlord_spend_limit: Schema.optional(
                Schema.NullOr(Schema.Number),
              ),
              landlord_float: Schema.optional(Schema.NullOr(Schema.Number)),
              landlord_contractor_details: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              council_tax_included_in_rent: Schema.optional(
                Schema.NullOr(Schema.Boolean),
              ),
              landlord_has_contractor: Schema.optional(
                Schema.NullOr(Schema.Boolean),
              ),
              property: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    business_name: Schema.optional(Schema.Unknown),
                    system_search_key: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    adr_latitude: Schema.optional(Schema.NullOr(Schema.String)),
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
                    adr_postcode: Schema.optional(Schema.NullOr(Schema.String)),
                    adr_country: Schema.optional(Schema.NullOr(Schema.String)),
                    adr_estate_name: Schema.optional(Schema.Unknown),
                    adr_estate_stage: Schema.optional(Schema.Unknown),
                    title_number: Schema.optional(Schema.NullOr(Schema.String)),
                    meta_zone: Schema.optional(Schema.Unknown),
                    system_owner_user: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          name: Schema.optional(Schema.NullOr(Schema.String)),
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
                          name: Schema.optional(Schema.NullOr(Schema.String)),
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
                          building_image: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                uri: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                url: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                thumbs: Schema.optional(
                                  Schema.NullOr(
                                    Schema.Struct({
                                      "800x600": Schema.optional(
                                        Schema.NullOr(
                                          Schema.Struct({
                                            uri: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                            url: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                          }),
                                        ),
                                      ),
                                      "400x300": Schema.optional(
                                        Schema.NullOr(
                                          Schema.Struct({
                                            uri: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                            url: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                          }),
                                        ),
                                      ),
                                      "200x150": Schema.optional(
                                        Schema.NullOr(
                                          Schema.Struct({
                                            uri: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                            url: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                          }),
                                        ),
                                      ),
                                      "80x60": Schema.optional(
                                        Schema.NullOr(
                                          Schema.Struct({
                                            uri: Schema.optional(
                                              Schema.NullOr(Schema.String),
                                            ),
                                            url: Schema.optional(
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
                          id: Schema.optional(Schema.NullOr(Schema.Number)),
                        }),
                      ),
                    ),
                    property_category: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                    property_image: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          uri: Schema.optional(Schema.NullOr(Schema.String)),
                          url: Schema.optional(Schema.NullOr(Schema.String)),
                          thumbs: Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                "800x600": Schema.optional(
                                  Schema.NullOr(
                                    Schema.Struct({
                                      uri: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      url: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                    }),
                                  ),
                                ),
                                "400x300": Schema.optional(
                                  Schema.NullOr(
                                    Schema.Struct({
                                      uri: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      url: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                    }),
                                  ),
                                ),
                                "200x150": Schema.optional(
                                  Schema.NullOr(
                                    Schema.Struct({
                                      uri: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      url: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                    }),
                                  ),
                                ),
                                "80x60": Schema.optional(
                                  Schema.NullOr(
                                    Schema.Struct({
                                      uri: Schema.optional(
                                        Schema.NullOr(Schema.String),
                                      ),
                                      url: Schema.optional(
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
                    etag: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              listing_primary_image: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    uri: Schema.optional(Schema.NullOr(Schema.String)),
                    url: Schema.optional(Schema.NullOr(Schema.String)),
                    thumbs: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          "800x600": Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                uri: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                url: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                              }),
                            ),
                          ),
                          "400x300": Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                uri: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                url: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                              }),
                            ),
                          ),
                          "200x150": Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                uri: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                url: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                              }),
                            ),
                          ),
                          "80x60": Schema.optional(
                            Schema.NullOr(
                              Schema.Struct({
                                uri: Schema.optional(
                                  Schema.NullOr(Schema.String),
                                ),
                                url: Schema.optional(
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
              under_contract: Schema.optional(Schema.NullOr(Schema.Boolean)),
              under_application: Schema.optional(Schema.Unknown),
              hold_status: Schema.optional(Schema.Unknown),
              contract_status: Schema.optional(Schema.NullOr(Schema.String)),
              project_listing_status: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              application_status: Schema.optional(Schema.Unknown),
              listing_agent_1: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    name: Schema.optional(Schema.NullOr(Schema.String)),
                    first_name: Schema.optional(Schema.NullOr(Schema.String)),
                    last_name: Schema.optional(Schema.NullOr(Schema.String)),
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
              legal_solicitor: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    system_record_state: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    system_ctime: Schema.optional(Schema.NullOr(Schema.String)),
                    system_modtime: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    name: Schema.optional(Schema.NullOr(Schema.String)),
                    email_address: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    phone_number: Schema.optional(Schema.NullOr(Schema.String)),
                    fax_number: Schema.optional(Schema.Unknown),
                    is_dnd: Schema.optional(Schema.Unknown),
                    type: Schema.optional(Schema.NullOr(Schema.String)),
                    last_contacted_date: Schema.optional(Schema.Unknown),
                    name_last: Schema.optional(Schema.NullOr(Schema.String)),
                    address_postal: Schema.optional(Schema.Unknown),
                    address: Schema.optional(Schema.Unknown),
                    interest_level: Schema.optional(Schema.Unknown),
                    marketing_birthday: Schema.optional(Schema.Unknown),
                    marketing_enquiry_source: Schema.optional(Schema.Unknown),
                    marketing_gender: Schema.optional(Schema.Unknown),
                    marketing_postcode: Schema.optional(Schema.Unknown),
                    system_owner_user: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          name: Schema.optional(Schema.NullOr(Schema.String)),
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
                    marketing_enquiry_method: Schema.optional(Schema.Unknown),
                    etag: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              project_stage: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    name: Schema.optional(Schema.NullOr(Schema.String)),
                    project: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.Number)),
                          name: Schema.optional(Schema.NullOr(Schema.String)),
                          type: Schema.optional(
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
                          developer_logo: Schema.optional(Schema.Unknown),
                          estate_logo: Schema.optional(Schema.Unknown),
                        }),
                      ),
                    ),
                    full_name: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              location: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    text: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              authority_type: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    text: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              exclusivity: Schema.optional(Schema.Unknown),
              inspection_type: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    text: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              listing_category: Schema.optional(
                Schema.NullOr(
                  Schema.Struct({
                    id: Schema.optional(Schema.NullOr(Schema.String)),
                    text: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
              price_rent_period: Schema.optional(Schema.Unknown),
              price_rent_tax: Schema.optional(Schema.Unknown),
              comm_structure: Schema.optional(Schema.Unknown),
              comm_amount_model: Schema.optional(Schema.Unknown),
              etag: Schema.optional(Schema.NullOr(Schema.String)),
              id: Schema.optional(Schema.NullOr(Schema.Number)),
            }),
          ),
        ),
      ),
    ),
    total: Schema.optional(Schema.NullOr(Schema.Number)),
    viewstate_id: Schema.optional(Schema.Unknown),
    criteria: Schema.optional(Schema.NullOr(Schema.Array(Schema.Unknown))),
    order_by: Schema.optional(Schema.NullOr(Schema.Array(Schema.Unknown))),
  }),
);
export type ListingsSearchOutput = typeof ListingsSearchOutput.Type;

// The operation
/**
 * Perform a search
 */
export const ListingsSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsSearchInput,
  outputSchema: ListingsSearchOutput,
}));
