import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesCreateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  data: Schema.Struct({
    adr_unit_number: Schema.optional(Schema.NullOr(Schema.String)),
    adr_street_number: Schema.optional(Schema.NullOr(Schema.String)),
    adr_street_name: Schema.optional(Schema.String),
    adr_suburb_or_town: Schema.optional(Schema.String),
    adr_locality: Schema.optional(Schema.NullOr(Schema.String)),
    adr_state_or_region: Schema.optional(Schema.String),
    adr_postcode: Schema.optional(Schema.String),
    adr_country: Schema.optional(Schema.NullOr(Schema.String)),
    adr_latitude: Schema.optional(Schema.NullOr(Schema.Number)),
    adr_longitude: Schema.optional(Schema.NullOr(Schema.Number)),
    adr_building: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.NullOr(Schema.Number)),
        }),
      ),
    ),
    adr_estate_name: Schema.optional(Schema.NullOr(Schema.String)),
    adr_estate_stage: Schema.optional(Schema.NullOr(Schema.String)),
    title_number: Schema.optional(Schema.NullOr(Schema.String)),
    property_image_uri: Schema.optional(Schema.NullOr(Schema.String)),
    property_category: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.String),
      }),
    ),
    property_subcategory_id: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_business: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_council_exempt: Schema.optional(Schema.NullOr(Schema.Boolean)),
    meta_rates_council: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_bodycorp: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_water: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_land: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_other: Schema.optional(Schema.NullOr(Schema.String)),
    meta_rates_domestic: Schema.optional(Schema.NullOr(Schema.Number)),
    meta_parking_notes: Schema.optional(Schema.NullOr(Schema.String)),
    meta_zone: Schema.optional(Schema.NullOr(Schema.String)),
    meta_tax_band: Schema.optional(Schema.NullOr(Schema.String)),
    meta_council_authority: Schema.optional(Schema.NullOr(Schema.String)),
    is_dnd: Schema.optional(Schema.NullOr(Schema.Boolean)),
    business_name: Schema.optional(Schema.NullOr(Schema.String)),
    attr_bedrooms: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_bathrooms: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_ensuites: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_toilets: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_living_areas: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_garages: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_carports: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_open_spaces: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_floor: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_stories: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_buildarea: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_buildarea_m2: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_buildarea_unit_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_landarea: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_landarea_m2: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_landarea_unit_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_energy_rating: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_build_year: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_sleeps: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_roi_pa: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_takings: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_valuation_date: Schema.optional(Schema.NullOr(Schema.String)),
    attr_valuation_amount: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_valuation_land_amount: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_is_house_land: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_is_franchise: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_is_corner_block: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_land_depth_rear: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_land_depth_left: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_land_depth_right: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_land_frontage: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_land_crossover_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_exterior_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_roof_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_whole_part_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_tenure_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_tenure_ground_rent: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_tenure_service_charge: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_tenure_agent_id: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_tenure_expiry_year: Schema.optional(Schema.NullOr(Schema.Number)),
    attr_tenure_other: Schema.optional(Schema.NullOr(Schema.String)),
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
    attr_primary_sewerage_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_primary_water_supply_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_primary_electricity_supply_ids: Schema.optional(
      Schema.NullOr(Schema.String),
    ),
    attr_broadband_ids: Schema.optional(Schema.NullOr(Schema.String)),
    attr_last_flooded_date: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_flood_defences: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_sources_of_flooding_ids: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_restrictions: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_private_rights_of_way: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_public_rights_of_way: Schema.optional(Schema.NullOr(Schema.Boolean)),
    attr_stopcock_location: Schema.optional(Schema.NullOr(Schema.String)),
    attr_water_meter_location: Schema.optional(Schema.NullOr(Schema.String)),
    attr_electricity_meter_location: Schema.optional(
      Schema.NullOr(Schema.String),
    ),
    attr_gas_meter_location: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_gas: Schema.optional(Schema.NullOr(Schema.String)),
    attr_pre_paid_gas_meter: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_parking: Schema.optional(Schema.NullOr(Schema.String)),
    attr_parking_type_id: Schema.optional(Schema.NullOr(Schema.String)),
    attr_parking_details: Schema.optional(Schema.NullOr(Schema.String)),
    attr_has_open_space: Schema.optional(Schema.NullOr(Schema.String)),
    attr_open_space_details: Schema.optional(Schema.NullOr(Schema.String)),
    rural_fences: Schema.optional(Schema.NullOr(Schema.String)),
    rural_annual_rainfall: Schema.optional(Schema.NullOr(Schema.String)),
    rural_soil_types: Schema.optional(Schema.NullOr(Schema.String)),
    rural_improvements: Schema.optional(Schema.NullOr(Schema.String)),
    rural_irrigation: Schema.optional(Schema.NullOr(Schema.String)),
    rural_carrying_capacity: Schema.optional(Schema.NullOr(Schema.String)),
    rural_services: Schema.optional(Schema.NullOr(Schema.String)),
    default_property_image: Schema.optional(Schema.NullOr(Schema.String)),
    note: Schema.optional(Schema.NullOr(Schema.String)),
  }),
  return_id: Schema.optional(Schema.Boolean),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::create" }));
export type PropertiesCreateInput = typeof PropertiesCreateInput.Type;

// Output Schema
export const PropertiesCreateOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesCreateOutput = typeof PropertiesCreateOutput.Type;

// The operation
/**
 * Create a record and return a reference to the id
 */
export const PropertiesCreate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: PropertiesCreateInput,
  outputSchema: PropertiesCreateOutput,
}));
