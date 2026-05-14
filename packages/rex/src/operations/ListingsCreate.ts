import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsCreateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  data: Schema.Struct({
    authority_date_start: Schema.optional(Schema.NullOr(Schema.String)),
    authority_duration_days: Schema.optional(Schema.NullOr(Schema.String)),
    authority_date_expires: Schema.optional(Schema.NullOr(Schema.String)),
    price_advertise_as: Schema.optional(Schema.NullOr(Schema.String)),
    price_rent: Schema.optional(Schema.NullOr(Schema.Number)),
    price_match: Schema.optional(Schema.NullOr(Schema.Number)),
    price_bond: Schema.optional(Schema.NullOr(Schema.Number)),
    price_rent_per_m2: Schema.optional(Schema.NullOr(Schema.Number)),
    price_rent_period_id: Schema.optional(Schema.NullOr(Schema.String)),
    price_rent_tax_id: Schema.optional(Schema.NullOr(Schema.String)),
    available_from_date: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_alarm_code: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_notes: Schema.optional(Schema.NullOr(Schema.String)),
    tenancy_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    outgoings_annual: Schema.optional(Schema.NullOr(Schema.Number)),
    outgoings_rent_is_plus: Schema.optional(Schema.NullOr(Schema.String)),
    meta_highlight_1: Schema.optional(Schema.NullOr(Schema.String)),
    meta_highlight_2: Schema.optional(Schema.NullOr(Schema.String)),
    meta_highlight_3: Schema.optional(Schema.NullOr(Schema.String)),
    meta_other_features: Schema.optional(Schema.NullOr(Schema.String)),
    feedback_offer_level: Schema.optional(Schema.NullOr(Schema.Number)),
    feedback_price_rank: Schema.optional(Schema.NullOr(Schema.Number)),
    feedback_notes: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_lot: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_subdivision: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_address: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_description: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_titleref: Schema.optional(Schema.NullOr(Schema.String)),
    legal_vendor_name: Schema.optional(Schema.NullOr(Schema.String)),
    legal_vendor_residence: Schema.optional(Schema.String),
    inbound_unique_id: Schema.optional(Schema.NullOr(Schema.String)),
    inbound_last_update: Schema.optional(Schema.NullOr(Schema.String)),
    parent_listing_id: Schema.optional(Schema.NullOr(Schema.Number)),
    new_home: Schema.optional(Schema.NullOr(Schema.Boolean)),
    let_agreed: Schema.optional(Schema.NullOr(Schema.Boolean)),
    comm_structure_id: Schema.optional(Schema.NullOr(Schema.Number)),
    comm_amount_fixed: Schema.optional(Schema.NullOr(Schema.Number)),
    comm_amount_percentage: Schema.optional(Schema.NullOr(Schema.Number)),
    comm_is_inc_tax: Schema.optional(Schema.NullOr(Schema.Boolean)),
    comm_amount_model_id: Schema.optional(Schema.NullOr(Schema.String)),
    permit_number: Schema.optional(Schema.NullOr(Schema.Number)),
    property: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.Number),
      }),
    ),
    listing_agent_1: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    listing_agent_2: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    legal_solicitor_id: Schema.optional(Schema.NullOr(Schema.Number)),
    project_stage: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    location: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    authority_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    exclusivity: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    listing_category: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.String),
      }),
    ),
    landlord_spend_limit: Schema.optional(Schema.NullOr(Schema.Number)),
    landlord_float: Schema.optional(Schema.NullOr(Schema.Number)),
    landlord_contractor_details: Schema.optional(Schema.NullOr(Schema.String)),
    council_tax_included_in_rent: Schema.optional(
      Schema.NullOr(Schema.Boolean),
    ),
    landlord_has_contractor: Schema.optional(Schema.NullOr(Schema.Boolean)),
    related: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          property_features: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.Struct({
                  feature: Schema.optional(
                    Schema.Struct({
                      id: Schema.optional(Schema.String),
                    }),
                  ),
                }),
              ),
            ),
          ),
        }),
      ),
    ),
  }),
  return_id: Schema.optional(Schema.Boolean),
  options: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Listings::create" }));
export type ListingsCreateInput = typeof ListingsCreateInput.Type;

// Output Schema
export const ListingsCreateOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Struct({
    system_listing_state: Schema.optional(Schema.NullOr(Schema.String)),
    system_ctime: Schema.optional(Schema.NullOr(Schema.Number)),
    system_modtime: Schema.optional(Schema.NullOr(Schema.Number)),
    system_publication_time: Schema.optional(Schema.NullOr(Schema.Number)),
    system_publication_user_id: Schema.optional(Schema.NullOr(Schema.Number)),
    system_publication_status: Schema.optional(Schema.NullOr(Schema.String)),
    system_overpayment_balance: Schema.optional(Schema.Unknown),
    system_has_preupload_errors: Schema.optional(Schema.Unknown),
    authority_date_start: Schema.optional(Schema.NullOr(Schema.String)),
    authority_duration_days: Schema.optional(Schema.NullOr(Schema.Number)),
    authority_date_expires: Schema.optional(Schema.NullOr(Schema.String)),
    price_advertise_as: Schema.optional(Schema.NullOr(Schema.String)),
    price_est_rent_pw: Schema.optional(Schema.Unknown),
    price_rent: Schema.optional(Schema.Unknown),
    price_match: Schema.optional(Schema.NullOr(Schema.Number)),
    price_match_sale: Schema.optional(Schema.NullOr(Schema.Number)),
    price_match_rent_pa_inc_tax: Schema.optional(Schema.Unknown),
    price_bond: Schema.optional(Schema.Unknown),
    price_rent_per_m2: Schema.optional(Schema.Unknown),
    available_from_date: Schema.optional(Schema.Unknown),
    inspection_alarm_code: Schema.optional(Schema.NullOr(Schema.String)),
    inspection_notes: Schema.optional(Schema.NullOr(Schema.String)),
    tenancy_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    outgoings_annual: Schema.optional(Schema.Unknown),
    outgoings_rent_is_plus: Schema.optional(Schema.Unknown),
    meta_highlight_1: Schema.optional(Schema.Unknown),
    meta_highlight_2: Schema.optional(Schema.Unknown),
    meta_highlight_3: Schema.optional(Schema.Unknown),
    meta_other_features: Schema.optional(Schema.NullOr(Schema.String)),
    feedback_offer_level: Schema.optional(Schema.NullOr(Schema.Number)),
    feedback_price_rank: Schema.optional(Schema.NullOr(Schema.Number)),
    feedback_notes: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_lot: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_subdivision: Schema.optional(Schema.Unknown),
    legal_prop_address: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_description: Schema.optional(Schema.NullOr(Schema.String)),
    legal_prop_titleref: Schema.optional(Schema.NullOr(Schema.String)),
    legal_vendor_name: Schema.optional(Schema.NullOr(Schema.String)),
    legal_vendor_residence: Schema.optional(Schema.NullOr(Schema.String)),
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
    publish_to_portals: Schema.optional(Schema.NullOr(Schema.Boolean)),
    publish_to_automatch: Schema.optional(Schema.NullOr(Schema.Boolean)),
    publish_to_external: Schema.optional(Schema.NullOr(Schema.Boolean)),
    publish_to_general: Schema.optional(Schema.NullOr(Schema.Boolean)),
    status_is_not_for_sale: Schema.optional(Schema.Unknown),
    baseline_price: Schema.optional(Schema.Unknown),
    parent_listing_id: Schema.optional(Schema.Unknown),
    new_home: Schema.optional(Schema.Unknown),
    let_agreed: Schema.optional(Schema.Unknown),
    comm_amount_fixed: Schema.optional(Schema.Unknown),
    comm_amount_percentage: Schema.optional(Schema.Unknown),
    comm_is_inc_tax: Schema.optional(Schema.Unknown),
    comm_est_based_on_service: Schema.optional(Schema.NullOr(Schema.String)),
    comm_est_based_on_object_id: Schema.optional(Schema.NullOr(Schema.String)),
    comm_est_based_on_amount: Schema.optional(Schema.NullOr(Schema.String)),
    comm_est_amount_net_of_tax: Schema.optional(Schema.Unknown),
    comm_est_amount_inc_tax: Schema.optional(Schema.Unknown),
    permit_number: Schema.optional(Schema.Unknown),
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
    legal_solicitor: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          system_record_state: Schema.optional(Schema.NullOr(Schema.String)),
          system_ctime: Schema.optional(Schema.NullOr(Schema.String)),
          system_modtime: Schema.optional(Schema.NullOr(Schema.String)),
          name: Schema.optional(Schema.NullOr(Schema.String)),
          email_address: Schema.optional(Schema.NullOr(Schema.String)),
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
                first_name: Schema.optional(Schema.NullOr(Schema.String)),
                last_name: Schema.optional(Schema.NullOr(Schema.String)),
                email_address: Schema.optional(Schema.NullOr(Schema.String)),
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
                      id: Schema.optional(Schema.NullOr(Schema.String)),
                      text: Schema.optional(Schema.NullOr(Schema.String)),
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
    property: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          system_record_state: Schema.optional(Schema.NullOr(Schema.String)),
          system_ctime: Schema.optional(Schema.NullOr(Schema.Number)),
          system_modtime: Schema.optional(Schema.NullOr(Schema.Number)),
          system_search_key: Schema.optional(Schema.NullOr(Schema.String)),
          adr_unit_number: Schema.optional(Schema.NullOr(Schema.String)),
          adr_street_number: Schema.optional(Schema.NullOr(Schema.String)),
          adr_street_name: Schema.optional(Schema.NullOr(Schema.String)),
          adr_suburb_or_town: Schema.optional(Schema.NullOr(Schema.String)),
          adr_locality: Schema.optional(Schema.Unknown),
          adr_state_or_region: Schema.optional(Schema.NullOr(Schema.String)),
          adr_postcode: Schema.optional(Schema.NullOr(Schema.String)),
          adr_country: Schema.optional(Schema.NullOr(Schema.String)),
          adr_estate_name: Schema.optional(Schema.Unknown),
          adr_estate_stage: Schema.optional(Schema.Unknown),
          title_number: Schema.optional(Schema.NullOr(Schema.String)),
          property_subcategory_id: Schema.optional(Schema.Unknown),
          meta_rates_business: Schema.optional(Schema.NullOr(Schema.String)),
          meta_rates_council_exempt: Schema.optional(
            Schema.NullOr(Schema.Boolean),
          ),
          meta_rates_council: Schema.optional(Schema.NullOr(Schema.String)),
          meta_rates_bodycorp: Schema.optional(Schema.NullOr(Schema.String)),
          meta_rates_water: Schema.optional(Schema.NullOr(Schema.String)),
          meta_rates_land: Schema.optional(Schema.Unknown),
          meta_rates_other: Schema.optional(Schema.Unknown),
          meta_rates_domestic: Schema.optional(Schema.NullOr(Schema.Number)),
          meta_parking_notes: Schema.optional(Schema.Unknown),
          meta_zone: Schema.optional(Schema.Unknown),
          meta_tax_band: Schema.optional(Schema.Unknown),
          meta_council_authority: Schema.optional(Schema.Unknown),
          is_dnd: Schema.optional(Schema.Unknown),
          business_name: Schema.optional(Schema.Unknown),
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
          adr_latitude: Schema.optional(Schema.NullOr(Schema.String)),
          adr_longitude: Schema.optional(Schema.NullOr(Schema.String)),
          attr_bedrooms: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_bathrooms: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_ensuites: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_toilets: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_living_areas: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_garages: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_carports: Schema.optional(Schema.NullOr(Schema.String)),
          attr_open_spaces: Schema.optional(Schema.NullOr(Schema.String)),
          attr_total_car_accom: Schema.optional(Schema.NullOr(Schema.String)),
          attr_buildarea: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_buildarea_m2: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_landarea: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_landarea_m2: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_energy_rating: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_build_year: Schema.optional(Schema.NullOr(Schema.String)),
          attr_sleeps: Schema.optional(Schema.Unknown),
          attr_roi_pa: Schema.optional(Schema.Unknown),
          attr_takings: Schema.optional(Schema.Unknown),
          attr_valuation_date: Schema.optional(Schema.NullOr(Schema.String)),
          attr_valuation_amount: Schema.optional(Schema.NullOr(Schema.Number)),
          attr_valuation_land_amount: Schema.optional(Schema.Unknown),
          attr_is_house_land: Schema.optional(Schema.Unknown),
          attr_is_franchise: Schema.optional(Schema.Unknown),
          attr_is_corner_block: Schema.optional(Schema.Unknown),
          attr_land_depth_rear: Schema.optional(Schema.Unknown),
          attr_land_depth_left: Schema.optional(Schema.Unknown),
          attr_land_depth_right: Schema.optional(Schema.Unknown),
          attr_land_frontage: Schema.optional(Schema.Unknown),
          attr_tenure_ground_rent: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_tenure_service_charge: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_tenure_expiry_year: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_tenure_other: Schema.optional(Schema.Unknown),
          attr_tenure_ground_rent_review_year: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_tenure_ground_rent_increase_percentage: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_shared_ownership_percentage: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_shared_ownership: Schema.optional(Schema.NullOr(Schema.Boolean)),
          attr_shared_ownership_rent: Schema.optional(
            Schema.NullOr(Schema.Number),
          ),
          attr_shared_ownership_rent_period_id: Schema.optional(
            Schema.NullOr(Schema.String),
          ),
          rural_fences: Schema.optional(Schema.Unknown),
          rural_annual_rainfall: Schema.optional(Schema.Unknown),
          rural_soil_types: Schema.optional(Schema.Unknown),
          rural_improvements: Schema.optional(Schema.Unknown),
          rural_irrigation: Schema.optional(Schema.Unknown),
          rural_carrying_capacity: Schema.optional(Schema.Unknown),
          rural_services: Schema.optional(Schema.Unknown),
          adr_building: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                name: Schema.optional(Schema.NullOr(Schema.String)),
                adr_street_number: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_street_name: Schema.optional(Schema.NullOr(Schema.String)),
                adr_suburb_or_town: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_state_or_region: Schema.optional(
                  Schema.NullOr(Schema.String),
                ),
                adr_locality: Schema.optional(Schema.Unknown),
                adr_postcode: Schema.optional(Schema.NullOr(Schema.String)),
                adr_country: Schema.optional(Schema.NullOr(Schema.String)),
                building_image: Schema.optional(
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
                id: Schema.optional(Schema.NullOr(Schema.Number)),
              }),
            ),
          ),
          attr_buildarea_unit: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                text: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          attr_landarea_unit: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                text: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          attr_roof: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                text: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          attr_exterior: Schema.optional(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                text: Schema.optional(Schema.NullOr(Schema.String)),
              }),
            ),
          ),
          attr_whole_part: Schema.optional(Schema.Unknown),
          attr_land_crossover: Schema.optional(Schema.Unknown),
          attr_tenure: Schema.optional(Schema.Unknown),
          attr_tenure_agent: Schema.optional(Schema.Unknown),
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
                            uri: Schema.optional(Schema.NullOr(Schema.String)),
                            url: Schema.optional(Schema.NullOr(Schema.String)),
                          }),
                        ),
                      ),
                      "400x300": Schema.optional(
                        Schema.NullOr(
                          Schema.Struct({
                            uri: Schema.optional(Schema.NullOr(Schema.String)),
                            url: Schema.optional(Schema.NullOr(Schema.String)),
                          }),
                        ),
                      ),
                      "200x150": Schema.optional(
                        Schema.NullOr(
                          Schema.Struct({
                            uri: Schema.optional(Schema.NullOr(Schema.String)),
                            url: Schema.optional(Schema.NullOr(Schema.String)),
                          }),
                        ),
                      ),
                      "80x60": Schema.optional(
                        Schema.NullOr(
                          Schema.Struct({
                            uri: Schema.optional(Schema.NullOr(Schema.String)),
                            url: Schema.optional(Schema.NullOr(Schema.String)),
                          }),
                        ),
                      ),
                    }),
                  ),
                ),
              }),
            ),
          ),
          security_user_rights: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
          ),
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    landlord_spend_limit: Schema.optional(Schema.NullOr(Schema.Number)),
    landlord_float: Schema.optional(Schema.NullOr(Schema.Number)),
    landlord_contractor_details: Schema.optional(Schema.NullOr(Schema.String)),
    council_tax_included_in_rent: Schema.optional(
      Schema.NullOr(Schema.Boolean),
    ),
    landlord_has_contractor: Schema.optional(Schema.NullOr(Schema.Boolean)),
    related: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          property_features: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    feature_id: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    feature_name: Schema.optional(Schema.NullOr(Schema.String)),
                    feature: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                  }),
                ),
              ),
            ),
          ),
          property_views: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    view_id: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    view_name: Schema.optional(Schema.NullOr(Schema.String)),
                    view: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                  }),
                ),
              ),
            ),
          ),
          property_tags: Schema.optional(
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
          listing_idealfors: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    idealfor_id: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    idealfor_name: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    idealfor: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
                        }),
                      ),
                    ),
                  }),
                ),
              ),
            ),
          ),
          listing_allowances: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          listing_adverts: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    advert_type: Schema.optional(Schema.NullOr(Schema.String)),
                    advert_heading: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    advert_body: Schema.optional(Schema.NullOr(Schema.String)),
                  }),
                ),
              ),
            ),
          ),
          listing_events: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    event_type: Schema.optional(Schema.NullOr(Schema.String)),
                    event_time: Schema.optional(Schema.NullOr(Schema.String)),
                    event_date: Schema.optional(Schema.NullOr(Schema.String)),
                    event_venue: Schema.optional(Schema.Unknown),
                    event_duration_minutes: Schema.optional(
                      Schema.NullOr(Schema.String),
                    ),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    event_agent: Schema.optional(
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
                  }),
                ),
              ),
            ),
          ),
          listing_images: Schema.optional(
            Schema.NullOr(
              Schema.Array(
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
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    system_modtime: Schema.optional(
                      Schema.NullOr(Schema.Number),
                    ),
                    priority: Schema.optional(Schema.NullOr(Schema.String)),
                    inbound_original_src_url: Schema.optional(Schema.Unknown),
                    inbound_last_update: Schema.optional(Schema.Unknown),
                    inbound_index: Schema.optional(Schema.Unknown),
                  }),
                ),
              ),
            ),
          ),
          listing_documents: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          listing_insurances: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          listing_floorplans: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    uri: Schema.optional(Schema.NullOr(Schema.String)),
                    url: Schema.optional(Schema.NullOr(Schema.String)),
                    thumbs: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          "800x800": Schema.optional(
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
                          "400x400": Schema.optional(
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
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    system_modtime: Schema.optional(
                      Schema.NullOr(Schema.Number),
                    ),
                    priority: Schema.optional(Schema.NullOr(Schema.String)),
                    inbound_original_src_url: Schema.optional(Schema.Unknown),
                    inbound_last_update: Schema.optional(Schema.Unknown),
                    inbound_index: Schema.optional(Schema.Unknown),
                  }),
                ),
              ),
            ),
          ),
          listing_holidaybookings: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
          ),
          listing_links: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    link_type: Schema.optional(Schema.NullOr(Schema.String)),
                    link_url: Schema.optional(Schema.NullOr(Schema.String)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                  }),
                ),
              ),
            ),
          ),
          listing_subcategories: Schema.optional(
            Schema.NullOr(
              Schema.Array(
                Schema.NullOr(
                  Schema.Struct({
                    priority: Schema.optional(Schema.NullOr(Schema.Number)),
                    id: Schema.optional(Schema.NullOr(Schema.Number)),
                    subcategory: Schema.optional(
                      Schema.NullOr(
                        Schema.Struct({
                          id: Schema.optional(Schema.NullOr(Schema.String)),
                          text: Schema.optional(Schema.NullOr(Schema.String)),
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
    security_user_rights: Schema.optional(
      Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
    ),
  }),
);
export type ListingsCreateOutput = typeof ListingsCreateOutput.Type;

// The operation
/**
 * Create a record and return a reference to the id
 */
export const ListingsCreate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: ListingsCreateInput,
  outputSchema: ListingsCreateOutput,
}));
