import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesDescribeSearchFieldsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    include_detail: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Properties::describeSearchFields",
    }),
  );
export type PropertiesDescribeSearchFieldsInput =
  typeof PropertiesDescribeSearchFieldsInput.Type;

// Output Schema
export const PropertiesDescribeSearchFieldsOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
    Schema.Struct({
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
  );
export type PropertiesDescribeSearchFieldsOutput =
  typeof PropertiesDescribeSearchFieldsOutput.Type;

// The operation
/**
 * Describes search fields
 */
export const PropertiesDescribeSearchFields =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: PropertiesDescribeSearchFieldsInput,
    outputSchema: PropertiesDescribeSearchFieldsOutput,
  }));
