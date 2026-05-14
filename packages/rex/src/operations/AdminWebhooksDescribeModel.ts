import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksDescribeModelInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({ method: "POST", path: "/v1/rex/AdminWebhooks::describeModel" }),
  );
export type AdminWebhooksDescribeModelInput =
  typeof AdminWebhooksDescribeModelInput.Type;

// Output Schema
export const AdminWebhooksDescribeModelOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
    Schema.Struct({
      search_result_formats: Schema.optional(
        Schema.NullOr(
          Schema.Array(
            Schema.NullOr(
              Schema.Struct({
                id: Schema.optional(Schema.NullOr(Schema.String)),
                description: Schema.optional(Schema.NullOr(Schema.String)),
                limit: Schema.optional(Schema.NullOr(Schema.Number)),
              }),
            ),
          ),
        ),
      ),
      delete_modes: Schema.optional(
        Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
      ),
      data_structure: Schema.optional(
        Schema.NullOr(
          Schema.Struct({
            description: Schema.optional(Schema.NullOr(Schema.String)),
            structure: Schema.optional(
              Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
            ),
          }),
        ),
      ),
      read_fields: Schema.optional(
        Schema.NullOr(
          Schema.Struct({
            core: Schema.optional(Schema.NullOr(Schema.String)),
          }),
        ),
      ),
      read_extra_fields: Schema.optional(Schema.NullOr(Schema.Struct({}))),
      searchable_fields: Schema.optional(
        Schema.NullOr(
          Schema.Struct({
            system_owner_user_id: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  options: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        source: Schema.optional(Schema.NullOr(Schema.String)),
                        list: Schema.optional(Schema.NullOr(Schema.String)),
                      }),
                    ),
                  ),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
            system_created_user_id: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  options: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        source: Schema.optional(Schema.NullOr(Schema.String)),
                        list: Schema.optional(Schema.NullOr(Schema.String)),
                      }),
                    ),
                  ),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
            system_modified_user_id: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  options: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        source: Schema.optional(Schema.NullOr(Schema.String)),
                        list: Schema.optional(Schema.NullOr(Schema.String)),
                      }),
                    ),
                  ),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
            system_ctime: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
            system_modtime: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
            id: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
            system_record_state: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  name: Schema.optional(Schema.NullOr(Schema.String)),
                  label: Schema.optional(Schema.NullOr(Schema.String)),
                  type: Schema.optional(Schema.NullOr(Schema.String)),
                  options: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        source: Schema.optional(Schema.NullOr(Schema.String)),
                        list: Schema.optional(Schema.NullOr(Schema.String)),
                      }),
                    ),
                  ),
                  real_field: Schema.optional(Schema.NullOr(Schema.Boolean)),
                  category: Schema.optional(Schema.NullOr(Schema.String)),
                }),
              ),
            ),
          }),
        ),
      ),
      orderby_fields: Schema.optional(
        Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
      ),
      export_options: Schema.optional(
        Schema.NullOr(Schema.Array(Schema.Unknown)),
      ),
    }),
  );
export type AdminWebhooksDescribeModelOutput =
  typeof AdminWebhooksDescribeModelOutput.Type;

// The operation
/**
 * Describes certain characteristics of the model including searchable fields, orderby fields and delete modes
 */
export const AdminWebhooksDescribeModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: AdminWebhooksDescribeModelInput,
    outputSchema: AdminWebhooksDescribeModelOutput,
  }),
);
