import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesGetListingImagesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
    limit: Schema.optional(Schema.Number),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Properties::getListingImages" }),
  );
export type PropertiesGetListingImagesInput =
  typeof PropertiesGetListingImagesInput.Type;

// Output Schema
export const PropertiesGetListingImagesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type PropertiesGetListingImagesOutput =
  typeof PropertiesGetListingImagesOutput.Type;

// The operation
/**
 * Returns a collection of all the listing images from all active listings of this property ordered by the date of the listing and the priority of the image
 */
export const PropertiesGetListingImages = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: PropertiesGetListingImagesInput,
    outputSchema: PropertiesGetListingImagesOutput,
  }),
);
