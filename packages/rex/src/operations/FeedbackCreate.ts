import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackCreateInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  data: Schema.Struct({
    date_of: Schema.optional(Schema.String),
    date_time_start: Schema.optional(Schema.NullOr(Schema.String)),
    date_time_finish: Schema.optional(Schema.NullOr(Schema.String)),
    listing: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.Number),
        }),
      ),
    ),
    project: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.Number),
        }),
      ),
    ),
    project_stage: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.Number),
        }),
      ),
    ),
    amount_of: Schema.optional(Schema.NullOr(Schema.Number)),
    price_previous_advertising: Schema.optional(Schema.NullOr(Schema.String)),
    price_previous_match: Schema.optional(Schema.NullOr(Schema.Number)),
    price_new_advertising: Schema.optional(Schema.NullOr(Schema.String)),
    price_new_match: Schema.optional(Schema.NullOr(Schema.Number)),
    number_of_people: Schema.optional(Schema.NullOr(Schema.Number)),
    agent: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.Number),
        }),
      ),
    ),
    note: Schema.optional(Schema.NullOr(Schema.String)),
    enquiry_source: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.String),
        }),
      ),
    ),
    interest_level: Schema.optional(
      Schema.NullOr(
        Schema.Struct({
          id: Schema.optional(Schema.String),
        }),
      ),
    ),
    feedback_type: Schema.optional(
      Schema.Struct({
        id: Schema.optional(Schema.String),
      }),
    ),
    related: Schema.optional(
      Schema.Struct({
        feedback_contacts: Schema.optional(
          Schema.NullOr(
            Schema.Array(
              Schema.Struct({
                contact_id: Schema.optional(Schema.Number),
              }),
            ),
          ),
        ),
        feedback_individual: Schema.optional(
          Schema.NullOr(
            Schema.Array(
              Schema.Struct({
                contacts: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      contact_id: Schema.optional(Schema.Number),
                    }),
                  ),
                ),
                enquiry_source_id: Schema.optional(Schema.String),
                interest_level_id: Schema.optional(Schema.String),
                price_indication: Schema.optional(
                  Schema.NullOr(Schema.Unknown),
                ),
                note: Schema.optional(Schema.String),
              }),
            ),
          ),
        ),
      }),
    ),
  }),
  return_id: Schema.optional(Schema.Boolean),
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Feedback::create" }));
export type FeedbackCreateInput = typeof FeedbackCreateInput.Type;

// Output Schema
export const FeedbackCreateOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackCreateOutput = typeof FeedbackCreateOutput.Type;

// The operation
/**
 * Create a record and return a reference to the id
 */
export const FeedbackCreate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: FeedbackCreateInput,
  outputSchema: FeedbackCreateOutput,
}));
