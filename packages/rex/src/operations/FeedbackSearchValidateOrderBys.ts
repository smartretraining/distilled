import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const FeedbackSearchValidateOrderBysInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    order_bys: Schema.Array(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Feedback::searchValidateOrderBys",
    }),
  );
export type FeedbackSearchValidateOrderBysInput =
  typeof FeedbackSearchValidateOrderBysInput.Type;

// Output Schema
export const FeedbackSearchValidateOrderBysOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type FeedbackSearchValidateOrderBysOutput =
  typeof FeedbackSearchValidateOrderBysOutput.Type;

// The operation
/**
 * Validates orderby based on allowable (orderby) fields. If orderby fields provided, uses this, otherwise limited to non restricted search fields.
 */
export const FeedbackSearchValidateOrderBys =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: FeedbackSearchValidateOrderBysInput,
    outputSchema: FeedbackSearchValidateOrderBysOutput,
  }));
