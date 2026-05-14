import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesReadInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
  fields: Schema.optional(Schema.NullOr(Schema.Array(Schema.Unknown))),
  extra_fields: Schema.optional(Schema.NullOr(Schema.Array(Schema.Unknown))),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::read" }));
export type PropertiesReadInput = typeof PropertiesReadInput.Type;

// Output Schema
export const PropertiesReadOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
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
    meta_rates_business: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_council_exempt: Schema.optional(Schema.NullOr(Schema.Boolean)),
    meta_rates_council: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_bodycorp: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_water: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_land: Schema.optional(Schema.Unknown),
    meta_rates_other: Schema.optional(Schema.Unknown),
    meta_rates_domestic: Schema.optional(Schema.NullOr(Schema.Number)),
    meta_parking_notes: Schema.optional(Schema.Unknown),
    meta_zone: Schema.optional(Schema.Unknown),
    meta_tax_band: Schema.optional(Schema.NullOr(Schema.String)),
    meta_council_authority: Schema.optional(Schema.Unknown),
    is_dnd: Schema.optional(Schema.Unknown),
    business_name: Schema.optional(Schema.Unknown),
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
    attr_floor: Schema.optional(Schema.NullOr(Schema.String)),
    attr_stories: Schema.optional(Schema.Unknown),
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
    attr_tenure_ground_rent: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_tenure_service_charge: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_tenure_expiry_year: Schema.optional(Schema.NullOr(Schema.Number)),
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
    attr_shared_ownership_rent: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_shared_ownership_rent_period_id: Schema.optional(
      Schema.NullOr(Schema.String),
    ),
    attr_stopcock_location: Schema.optional(Schema.NullOr(Schema.String)),
    attr_water_meter_location: Schema.optional(Schema.NullOr(Schema.String)),
    attr_electricity_meter_location: Schema.optional(
      Schema.NullOr(Schema.String),
    ),
    attr_gas_meter_location: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_gas: Schema.optional(Schema.NullOr(Schema.String)),
    attr_pre_paid_gas_meter: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_open_space: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_parking: Schema.optional(Schema.NullOr(Schema.String)),
    attr_parking_type: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    attr_parking_details: Schema.optional(Schema.NullOr(Schema.String)),
    attr_open_space_details: Schema.optional(Schema.Unknown),
    attr_primary_sewerage: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    attr_primary_water_supply: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.String)),
          text: Schema.optional(Schema.NullOr(Schema.String)),
        }),
      ),
    ),
    attr_primary_electricity_supply: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              id: Schema.optional(Schema.NullOr(Schema.String)),
              text: Schema.optional(Schema.NullOr(Schema.String)),
            }),
          ),
        ),
      ),
    ),
    attr_broadband: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              id: Schema.optional(Schema.NullOr(Schema.String)),
              text: Schema.optional(Schema.NullOr(Schema.String)),
            }),
          ),
        ),
      ),
    ),
    attr_sources_of_flooding: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              id: Schema.optional(Schema.NullOr(Schema.String)),
              text: Schema.optional(Schema.NullOr(Schema.String)),
            }),
          ),
        ),
      ),
    ),
    attr_last_flooded_date: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_flood_defences: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_has_restrictions: Schema.optional(Schema.Unknown),
    attr_private_rights_of_way: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_public_rights_of_way: Schema.optional(Schema.Unknown),
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
          adr_street_number: Schema.optional(Schema.NullOr(Schema.String)),
          adr_street_name: Schema.optional(Schema.NullOr(Schema.String)),
          adr_suburb_or_town: Schema.optional(Schema.NullOr(Schema.String)),
          adr_state_or_region: Schema.optional(Schema.NullOr(Schema.String)),
          adr_locality: Schema.optional(Schema.Unknown),
          adr_postcode: Schema.optional(Schema.NullOr(Schema.String)),
          adr_country: Schema.optional(Schema.NullOr(Schema.String)),
          building_image: Schema.optional(Schema.Unknown),
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
    note: Schema.optional(Schema.Unknown),
    related: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
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
          property_documents: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Unknown)),
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
                          is_dnd: Schema.optional(Schema.NullOr(Schema.String)),
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
                          marketing_enquiry_method: Schema.optional(
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
        }),
      ),
    ),
    security_user_rights: Schema.optional(
      Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
    ),
  }),
);
export type PropertiesReadOutput = typeof PropertiesReadOutput.Type;

// The operation
/**
 * Read a record by id
 */
export const PropertiesRead = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: PropertiesReadInput,
  outputSchema: PropertiesReadOutput,
}));
