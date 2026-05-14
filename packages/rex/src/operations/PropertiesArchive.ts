import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesArchiveInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct(
  {
    id: Schema.Number,
  },
).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::archive" }));
export type PropertiesArchiveInput = typeof PropertiesArchiveInput.Type;

// Output Schema
export const PropertiesArchiveOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type PropertiesArchiveOutput = typeof PropertiesArchiveOutput.Type;

// The operation
/**
 * Archives a record - archived records are omitted from search results but can be restored at any time.
 */
export const PropertiesArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: PropertiesArchiveInput,
  outputSchema: PropertiesArchiveOutput,
}));
