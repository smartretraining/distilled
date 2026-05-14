import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const PropertiesRecoverFromTrashInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    id: Schema.Number,
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Properties::recoverFromTrash" }),
  );
export type PropertiesRecoverFromTrashInput =
  typeof PropertiesRecoverFromTrashInput.Type;

// Output Schema
export const PropertiesRecoverFromTrashOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(Schema.Number);
export type PropertiesRecoverFromTrashOutput =
  typeof PropertiesRecoverFromTrashOutput.Type;

// The operation
/**
 * Recover a record from the trash
 *
 * Recovers a record from the trash
 */
export const PropertiesRecoverFromTrash = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: PropertiesRecoverFromTrashInput,
    outputSchema: PropertiesRecoverFromTrashOutput,
  }),
);
