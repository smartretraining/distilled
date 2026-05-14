import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesSetGeoLocationInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    latitude: Schema.Number,
    longitude: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Properties::setGeoLocation" }),
  );
export type PropertiesSetGeoLocationInput =
  typeof PropertiesSetGeoLocationInput.Type;

// Output Schema
export const PropertiesSetGeoLocationOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesSetGeoLocationOutput =
  typeof PropertiesSetGeoLocationOutput.Type;

// The operation
/**
 * Set geo location
 */
export const PropertiesSetGeoLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: PropertiesSetGeoLocationInput,
    outputSchema: PropertiesSetGeoLocationOutput,
  }),
);
