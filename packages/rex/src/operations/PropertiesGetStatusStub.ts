import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesGetStatusStubInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Properties::getStatusStub" }),
  );
export type PropertiesGetStatusStubInput =
  typeof PropertiesGetStatusStubInput.Type;

// Output Schema
export const PropertiesGetStatusStubOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesGetStatusStubOutput =
  typeof PropertiesGetStatusStubOutput.Type;

// The operation
/**
 * Get property status stub for record
 */
export const PropertiesGetStatusStub = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: PropertiesGetStatusStubInput,
    outputSchema: PropertiesGetStatusStubOutput,
  }),
);
