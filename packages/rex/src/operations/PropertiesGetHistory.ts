import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesGetHistoryInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    limit: Schema.optional(Schema.Number),
  }).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::getHistory" }));
export type PropertiesGetHistoryInput = typeof PropertiesGetHistoryInput.Type;

// Output Schema
export const PropertiesGetHistoryOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesGetHistoryOutput = typeof PropertiesGetHistoryOutput.Type;

// The operation
/**
 * Retrieves a stream of oabs, appraisals and listings for the property record
 */
export const PropertiesGetHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: PropertiesGetHistoryInput,
    outputSchema: PropertiesGetHistoryOutput,
  }),
);
