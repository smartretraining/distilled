import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminWebhooksGetEventsAndCategoriesInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/AdminWebhooks::getEventsAndCategories",
    }),
  );
export type AdminWebhooksGetEventsAndCategoriesInput =
  typeof AdminWebhooksGetEventsAndCategoriesInput.Type;

// Output Schema
export const AdminWebhooksGetEventsAndCategoriesOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type AdminWebhooksGetEventsAndCategoriesOutput =
  typeof AdminWebhooksGetEventsAndCategoriesOutput.Type;

// The operation
/**
 * Get event list
 */
export const AdminWebhooksGetEventsAndCategories =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: AdminWebhooksGetEventsAndCategoriesInput,
    outputSchema: AdminWebhooksGetEventsAndCategoriesOutput,
  }));
