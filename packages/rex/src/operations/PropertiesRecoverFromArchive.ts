import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesRecoverFromArchiveInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Properties::recoverFromArchive" }),
  );
export type PropertiesRecoverFromArchiveInput =
  typeof PropertiesRecoverFromArchiveInput.Type;

// Output Schema
export const PropertiesRecoverFromArchiveOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type PropertiesRecoverFromArchiveOutput =
  typeof PropertiesRecoverFromArchiveOutput.Type;

// The operation
/**
 * Recovers a record from the archive
 */
export const PropertiesRecoverFromArchive =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: PropertiesRecoverFromArchiveInput,
    outputSchema: PropertiesRecoverFromArchiveOutput,
  }));
