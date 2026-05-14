import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesSearchInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  criteria: Schema.optional(Schema.Unknown),
  order_by: Schema.optional(Schema.String),
  offset: Schema.optional(Schema.Number),
  limit: Schema.optional(Schema.Number),
  create_viewstate: Schema.optional(Schema.Boolean),
  result_format: Schema.optional(Schema.String),
  extra_options: Schema.optional(Schema.Array(Schema.Unknown)),
  search_state: Schema.optional(Schema.Unknown),
  ids_only: Schema.optional(Schema.Boolean),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::search" }));
export type PropertiesSearchInput = typeof PropertiesSearchInput.Type;

// Output Schema
export const PropertiesSearchOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Struct({
    rows: Schema.optional(
      Schema.NullOr(
        Schema.Array(
          Schema.NullOr(
            Schema.Struct({
              system_search_key: Schema.optional(Schema.NullOr(Schema.String)),
              system_record_state: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              system_ctime: Schema.optional(Schema.NullOr(Schema.String)),
              system_modtime: Schema.optional(Schema.NullOr(Schema.String)),
              business_name: Schema.optional(Schema.Unknown),
              adr_latitude: Schema.optional(Schema.Unknown),
              adr_longitude: Schema.optional(Schema.Unknown),
              adr_unit_number: Schema.optional(Schema.NullOr(Schema.String)),
              adr_street_number: Schema.optional(Schema.NullOr(Schema.String)),
              adr_street_name: Schema.optional(Schema.NullOr(Schema.String)),
              adr_state_or_region: Schema.optional(
                Schema.NullOr(Schema.String),
              ),
              adr_locality: Schema.optional(Schema.Unknown),
              adr_suburb_or_town: Schema.optional(Schema.NullOr(Schema.String)),
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
                    adr_postcode: Schema.optional(Schema.NullOr(Schema.String)),
                    adr_country: Schema.optional(Schema.NullOr(Schema.String)),
                    building_image: Schema.optional(Schema.Unknown),
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
export type PropertiesSearchOutput = typeof PropertiesSearchOutput.Type;

// The operation
/**
 * Perform a search
 */
export const PropertiesSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: PropertiesSearchInput,
  outputSchema: PropertiesSearchOutput,
}));
