import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesTrashInput = /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
  id: Schema.Number,
}).pipe(T.Http({ method: "POST", path: "/v1/rex/Properties::trash" }));
export type PropertiesTrashInput = typeof PropertiesTrashInput.Type;

// Output Schema
export const PropertiesTrashOutput = /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
  Schema.Number,
);
export type PropertiesTrashOutput = typeof PropertiesTrashOutput.Type;

// The operation
/**
 * Trash a record - trashed records are like archived records but may be recovered for 30 days after deletion (after which they are purged from the system).
 */
export const PropertiesTrash = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  inputSchema: PropertiesTrashInput,
  outputSchema: PropertiesTrashOutput,
}));
