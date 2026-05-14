import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsGetRexHomeAgencySettingsUrlInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Listings::getRexHomeAgencySettingsUrl",
    }),
  );
export type ListingsGetRexHomeAgencySettingsUrlInput =
  typeof ListingsGetRexHomeAgencySettingsUrlInput.Type;

// Output Schema
export const ListingsGetRexHomeAgencySettingsUrlOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsGetRexHomeAgencySettingsUrlOutput =
  typeof ListingsGetRexHomeAgencySettingsUrlOutput.Type;

// The operation
/**
 * Returns the url for the Rex Home agency settings page
 */
export const ListingsGetRexHomeAgencySettingsUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ListingsGetRexHomeAgencySettingsUrlInput,
    outputSchema: ListingsGetRexHomeAgencySettingsUrlOutput,
  }));
