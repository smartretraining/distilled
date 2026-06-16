import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsDescribeSearchFieldsInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    include_detail: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Contacts::describeSearchFields" }),
  );
export type ContactsDescribeSearchFieldsInput =
  typeof ContactsDescribeSearchFieldsInput.Type;

// Output Schema
export const ContactsDescribeSearchFieldsOutput =
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
export type ContactsDescribeSearchFieldsOutput =
  typeof ContactsDescribeSearchFieldsOutput.Type;

// The operation
/**
 * Describes search fields
 */
export const ContactsDescribeSearchFields =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ContactsDescribeSearchFieldsInput,
    outputSchema: ContactsDescribeSearchFieldsOutput,
  }));
